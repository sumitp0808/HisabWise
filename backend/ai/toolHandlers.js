const mongoose = require("mongoose");
const model = require("../models");

const MAX_EXPENSE_RESULTS = 50;
const MAX_SETTLEMENT_RESULTS = 50;

const getGroupsForUser = async (email) =>
  model.Group.find({ groupMembers: email }).sort({ createdAt: -1 }).lean();

const userBalance = (group, email) => {
  const split = Array.isArray(group.split) ? group.split[0] : group.split;
  const balance = Number(split?.[email] || 0);

  return {
    balance,
    amountOwed: balance < 0 ? Math.abs(balance) : 0,
    amountOwedToYou: balance > 0 ? balance : 0,
  };
};

const resolveGroup = async (groups, args = {}) => {
  const groupId = typeof args.groupId === "string" ? args.groupId.trim() : "";
  const groupName = typeof args.groupName === "string" ? args.groupName.trim() : "";

  if (!groupId && !groupName) {
    return { error: "Choose a group by its ID or exact name." };
  }

  let matches = groupId ? groups.filter((group) => String(group._id) === groupId) : [];

  if (groupId && matches.length === 0 && !mongoose.isValidObjectId(groupId)) {
    return { error: "That group could not be found in your groups." };
  }

  if (!groupId && groupName) {
    const normalizedName = groupName.toLocaleLowerCase();
    matches = groups.filter((group) => group.groupName.toLocaleLowerCase() === normalizedName);
    if (matches.length === 0) {
      matches = groups.filter((group) => group.groupName.toLocaleLowerCase().includes(normalizedName));
    }
  }

  if (matches.length > 1) {
    return {
      error: "More than one of your groups matches that name. Ask the user which group they mean.",
      matches: matches.map(({ _id, groupName: name }) => ({ groupId: String(_id), groupName: name })),
    };
  }

  if (matches.length === 0) {
    return { error: "That group could not be found in your groups." };
  }

  return { group: matches[0] };
};

const getNamesByEmail = async (emails) => {
  const users = await model.User.find({ emailId: { $in: [...new Set(emails)] } })
    .select("emailId firstName lastName")
    .lean();

  return new Map(
    users.map((user) => [
      user.emailId,
      [user.firstName, user.lastName].filter(Boolean).join(" "),
    ])
  );
};

const getUserGroups = async (email) => {
  const groups = await getGroupsForUser(email);
  return {
    groups: groups.map((group) => ({
      groupId: String(group._id),
      groupName: group.groupName,
      currency: group.groupCurrency,
      totalExpenses: Number(group.groupTotal || 0),
      ...userBalance(group, email),
    })),
  };
};

const getGroupDetails = async (email, args) => {
  const groups = await getGroupsForUser(email);
  const result = await resolveGroup(groups, args);
  if (result.error) return result;

  const group = result.group;
  const memberNames = await getNamesByEmail(group.groupMembers);
  const expenseCount = await model.Expense.countDocuments({ groupId: String(group._id) });

  return {
    groupId: String(group._id),
    groupName: group.groupName,
    description: group.groupDescription || "",
    currency: group.groupCurrency,
    category: group.groupCategory,
    totalExpenses: Number(group.groupTotal || 0),
    expenseCount,
    members: group.groupMembers.map((member) => ({
      name: memberNames.get(member) || "Group member",
      isYou: member === email,
    })),
    ...userBalance(group, email),
  };
};

const getGroupBalance = async (email, args) => {
  const groups = await getGroupsForUser(email);
  const result = await resolveGroup(groups, args);
  if (result.error) return result;

  return {
    groupName: result.group.groupName,
    currency: result.group.groupCurrency,
    ...userBalance(result.group, email),
  };
};

const getAllBalances = async (email) => {
  const groups = await getGroupsForUser(email);
  const totalsByCurrency = {};
  const peopleOwingYouByCurrency = {};
  const balances = groups.map((group) => {
    const balance = userBalance(group, email);
    const currency = group.groupCurrency || "INR";
    totalsByCurrency[currency] ||= { amountOwed: 0, amountOwedToYou: 0 };
    totalsByCurrency[currency].amountOwed += balance.amountOwed;
    totalsByCurrency[currency].amountOwedToYou += balance.amountOwedToYou;

    return {
      groupId: String(group._id),
      groupName: group.groupName,
      currency,
      ...balance,
    };
  });

  if (groups.length > 0) {
    const groupIds = groups.map((group) => String(group._id));
    const [expenses, settlements] = await Promise.all([
      model.Expense.find({ groupId: { $in: groupIds } })
        .select("groupId expenseAmount expenseOwner expenseMembers")
        .lean(),
      model.Settlement.find({ groupId: { $in: groupIds } })
        .select("groupId settleFrom settleTo settleAmount")
        .lean(),
    ]);
    const groupsById = new Map(groups.map((group) => [String(group._id), group]));
    const transfersByGroup = new Map();
    const recordTransfer = (groupId, from, to, amount) => {
      if (from === to || !Number.isFinite(amount) || amount === 0) return;
      if (!transfersByGroup.has(groupId)) transfersByGroup.set(groupId, new Map());
      const transfers = transfersByGroup.get(groupId);
      if (!transfers.has(from)) transfers.set(from, new Map());
      const debts = transfers.get(from);
      debts.set(to, (debts.get(to) || 0) + amount);
    };

    for (const expense of expenses) {
      const members = Array.isArray(expense.expenseMembers) ? expense.expenseMembers : [];
      if (members.length === 0) continue;
      const share = Math.round(
        (Number(expense.expenseAmount) / members.length + Number.EPSILON) * 100
      ) / 100;
      for (const member of members) {
        if (member !== expense.expenseOwner) {
          recordTransfer(expense.groupId, member, expense.expenseOwner, share);
        }
      }
    }

    for (const settlement of settlements) {
      recordTransfer(
        settlement.groupId,
        settlement.settleFrom,
        settlement.settleTo,
        -Number(settlement.settleAmount)
      );
    }

    for (const [groupId, transfers] of transfersByGroup) {
      const group = groupsById.get(groupId);
      if (!group) continue;
      for (const [member, creditors] of transfers) {
        const owedToYou = (creditors.get(email) || 0) -
          (transfers.get(email)?.get(member) || 0);
        if (owedToYou <= 0) continue;

        const currency = group.groupCurrency || "INR";
        peopleOwingYouByCurrency[currency] ||= new Map();
        const people = peopleOwingYouByCurrency[currency];
        people.set(member, (people.get(member) || 0) + owedToYou);
      }
    }
  }

  const debtorEmails = Object.values(peopleOwingYouByCurrency)
    .flatMap((people) => [...people.keys()]);
  const names = await getNamesByEmail(debtorEmails);
  const peopleOwingYou = Object.fromEntries(
    Object.entries(peopleOwingYouByCurrency).map(([currency, people]) => [
      currency,
      [...people.entries()]
        .map(([emailId, amount]) => ({
          name: names.get(emailId) || "Group member",
          amount,
        }))
        .sort((a, b) => b.amount - a.amount),
    ])
  );

  return { balances, totalsByCurrency, peopleOwingYou };
};

const getAccessibleExpenses = async (email, args = {}, limit = null) => {
  const groups = await getGroupsForUser(email);
  let selectedGroups = groups;

  if (args.groupId || args.groupName) {
    const result = await resolveGroup(groups, args);
    if (result.error) return result;
    selectedGroups = [result.group];
  }

  if (selectedGroups.length === 0) return { expenses: [], groups: selectedGroups };

  const query = {
    groupId: { $in: selectedGroups.map((group) => String(group._id)) },
    expenseMembers: email,
  };
  if (typeof args.category === "string" && args.category.trim()) {
    query.expenseCategory = args.category.trim();
  }
  if (args.startDate || args.endDate) {
    const dateRange = {};
    if (args.startDate) {
      const start = new Date(args.startDate);
      if (!Number.isFinite(start.getTime())) return { error: "The start date is invalid." };
      start.setUTCHours(0, 0, 0, 0);
      dateRange.$gte = start;
    }
    if (args.endDate) {
      const end = new Date(args.endDate);
      if (!Number.isFinite(end.getTime())) return { error: "The end date is invalid." };
      end.setUTCHours(23, 59, 59, 999);
      dateRange.$lte = end;
    }
    if (dateRange.$gte && dateRange.$lte && dateRange.$gte > dateRange.$lte) {
      return { error: "The start date must be on or before the end date." };
    }
    query.expenseDate = dateRange;
  }

  let expenseQuery = model.Expense.find(query)
    .select("groupId expenseName expenseDescription expenseAmount expenseCategory expenseCurrency expenseDate expenseOwner expensePerMember")
    .sort({ expenseDate: -1 });
  if (limit) expenseQuery = expenseQuery.limit(limit);

  return { expenses: await expenseQuery.lean(), groups: selectedGroups };
};

const formatExpenses = async (expenses, groups) => {
  const groupNames = new Map(groups.map((group) => [String(group._id), group.groupName]));
  const ownerNames = await getNamesByEmail(expenses.map((expense) => expense.expenseOwner));

  return expenses.map((expense) => ({
    name: expense.expenseName,
    description: expense.expenseDescription || "",
    category: expense.expenseCategory,
    amount: Number(expense.expenseAmount),
    userShare: Number(expense.expensePerMember),
    currency: expense.expenseCurrency,
    date: expense.expenseDate,
    paidBy: ownerNames.get(expense.expenseOwner) || "Group member",
    groupName: groupNames.get(expense.groupId) || "Group",
  }));
};

const getUserExpenses = async (email, args) => {
  const limit = Math.min(MAX_EXPENSE_RESULTS, Math.max(1, Number(args.limit) || 20));
  const result = await getAccessibleExpenses(email, args, limit);
  if (result.error) return result;

  return {
    expenses: await formatExpenses(result.expenses, result.groups),
    resultLimit: limit,
  };
};

const getHighestExpense = async (email, args) => {
  const result = await getAccessibleExpenses(email, args);
  if (result.error) return result;
  if (result.expenses.length === 0) return { expense: null, message: "No matching expenses were found." };

  const highest = result.expenses.reduce((current, expense) =>
    expense.expenseAmount > current.expenseAmount ? expense : current
  );
  const [expense] = await formatExpenses([highest], result.groups);
  return { expense };
};

const getRecentExpenses = async (email, args) => {
  const limit = Math.min(20, Math.max(1, Number(args.limit) || 5));
  const result = await getAccessibleExpenses(email, args, limit);
  if (result.error) return result;

  return { expenses: await formatExpenses(result.expenses, result.groups) };
};

const dateForPeriod = (period, now = new Date()) => {
  const currentMonth = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
  if (period === "this_month") {
    return { start: new Date(currentMonth), end: new Date(now) };
  }
  if (period === "last_month") {
    return {
      start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)),
      end: new Date(currentMonth - 1),
    };
  }
  return null;
};

const summarizeSpend = (expenses, groups) => {
  const groupNames = new Map(groups.map((group) => [String(group._id), group.groupName]));
  const totalsByCurrency = {};
  const categories = {};
  const monthly = {};
  const groupSpend = {};

  for (const expense of expenses) {
    const currency = expense.expenseCurrency || "INR";
    const share = Number(expense.expensePerMember) || 0;
    const month = new Date(expense.expenseDate).toISOString().slice(0, 7);
    totalsByCurrency[currency] = (totalsByCurrency[currency] || 0) + share;

    categories[currency] ||= {};
    categories[currency][expense.expenseCategory || "Others"] =
      (categories[currency][expense.expenseCategory || "Others"] || 0) + share;
    monthly[currency] ||= {};
    monthly[currency][month] = (monthly[currency][month] || 0) + share;
    groupSpend[currency] ||= {};
    const groupName = groupNames.get(expense.groupId) || "Group";
    groupSpend[currency][groupName] = (groupSpend[currency][groupName] || 0) + share;
  }

  return { totalsByCurrency, categories, monthly, groupSpend };
};

const getSpendingAnalytics = async (email, args) => {
  const period = ["this_month", "last_month", "month_over_month"].includes(args.period)
    ? args.period
    : "all_time";
  const groups = await getGroupsForUser(email);
  let selectedGroups = groups;

  if (args.groupId || args.groupName) {
    const result = await resolveGroup(groups, args);
    if (result.error) return result;
    selectedGroups = [result.group];
  }

  const months = period === "month_over_month" ? ["this_month", "last_month"] : [period];
  const summaries = {};
  for (const month of months) {
    const range = dateForPeriod(month);
    const query = {
      groupId: { $in: selectedGroups.map((group) => String(group._id)) },
      expenseMembers: email,
    };
    if (range) query.expenseDate = { $gte: range.start, $lte: range.end };
    if (args.startDate || args.endDate) {
      const dateFilter = {};
      if (args.startDate) {
        const start = new Date(args.startDate);
        if (!Number.isFinite(start.getTime())) return { error: "The start date is invalid." };
        start.setUTCHours(0, 0, 0, 0);
        dateFilter.$gte = start;
      }
      if (args.endDate) {
        const end = new Date(args.endDate);
        if (!Number.isFinite(end.getTime())) return { error: "The end date is invalid." };
        end.setUTCHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      if (dateFilter.$gte && dateFilter.$lte && dateFilter.$gte > dateFilter.$lte) {
        return { error: "The start date must be on or before the end date." };
      }
      const currentRange = query.expenseDate || {};
      const start = [currentRange.$gte, dateFilter.$gte]
        .filter(Boolean)
        .reduce((latest, date) => date > latest ? date : latest);
      const end = [currentRange.$lte, dateFilter.$lte]
        .filter(Boolean)
        .reduce((earliest, date) => date < earliest ? date : earliest);
      query.expenseDate = { $gte: start, $lte: end };
    }
    const expenses = selectedGroups.length
      ? await model.Expense.find(query)
        .select("groupId expensePerMember expenseCategory expenseCurrency expenseDate")
        .lean()
      : [];
    summaries[month] = summarizeSpend(expenses, selectedGroups);
  }

  if (period !== "month_over_month") {
    return { period, ...summaries[period] };
  }

  const current = summaries.this_month.totalsByCurrency;
  const previous = summaries.last_month.totalsByCurrency;
  const comparisons = {};
  for (const currency of new Set([...Object.keys(current), ...Object.keys(previous)])) {
    const currentSpend = current[currency] || 0;
    const previousSpend = previous[currency] || 0;
    comparisons[currency] = {
      thisMonth: currentSpend,
      lastMonth: previousSpend,
      difference: currentSpend - previousSpend,
      percentageChange: previousSpend === 0
        ? null
        : ((currentSpend - previousSpend) / previousSpend) * 100,
    };
  }

  return {
    period,
    comparisons,
    thisMonth: summaries.this_month,
    lastMonth: summaries.last_month,
  };
};

const getSettlementHistory = async (email, args) => {
  const groups = await getGroupsForUser(email);
  let selectedGroups = groups;
  if (args.groupId || args.groupName) {
    const result = await resolveGroup(groups, args);
    if (result.error) return result;
    selectedGroups = [result.group];
  }
  if (selectedGroups.length === 0) return { settlements: [] };

  const limit = Math.min(MAX_SETTLEMENT_RESULTS, Math.max(1, Number(args.limit) || 20));
  const settlements = await model.Settlement.find({
    groupId: { $in: selectedGroups.map((group) => String(group._id)) },
    $or: [{ settleFrom: email }, { settleTo: email }],
  }).sort({ createdAt: -1 }).limit(limit).lean();
  const names = await getNamesByEmail(
    settlements.flatMap(({ settleFrom, settleTo }) => [settleFrom, settleTo])
  );
  const groupNames = new Map(selectedGroups.map((group) => [String(group._id), group]));

  return {
    settlements: settlements.map((settlement) => {
      const group = groupNames.get(settlement.groupId);
      return {
        groupName: group?.groupName || "Group",
        currency: group?.groupCurrency || "INR",
        amount: Number(settlement.settleAmount),
        date: settlement.settleDate,
        from: names.get(settlement.settleFrom) || "Group member",
        to: names.get(settlement.settleTo) || "Group member",
        involvesYou: settlement.settleFrom === email || settlement.settleTo === email,
      };
    }),
  };
};

const handlers = {
  getUserGroups,
  getGroupDetails,
  getGroupBalance,
  getAllBalances,
  getUserExpenses,
  getHighestExpense,
  getRecentExpenses,
  getSpendingAnalytics,
  getSettlementHistory,
};

const executeTool = async (name, args, email) => {
  const handler = handlers[name];
  if (!handler) return { error: "That tool is not available." };
  return handler(email, args && typeof args === "object" ? args : {});
};

module.exports = { executeTool };

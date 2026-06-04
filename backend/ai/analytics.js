const model = require("../models");

const buildUserAnalytics = async (emailId) => {

  const expenses = await model.Expense.find({
    expenseMembers: emailId,
  });

  const groups = await model.Group.find({
    groupMembers: emailId,
  });

  let totalSpent = 0;

  const categoryMap = {};
  const monthlyMap = {};

  expenses.forEach((expense) => {

    totalSpent += expense.expensePerMember;

    categoryMap[expense.expenseCategory] =
      (categoryMap[expense.expenseCategory] || 0)
      + expense.expensePerMember;

    const month = new Date(expense.expenseDate).toLocaleString("default", {month: "long", year: "numeric",});

    monthlyMap[month] = (monthlyMap[month] || 0) + expense.expensePerMember;
  });

  const topCategory = Object.keys(categoryMap).length ? Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0][0]: "None";

  return {
    totalSpent,
    totalGroups: groups.length,
    totalExpenses: expenses.length,
    topCategory,
    categoryWiseSpend: categoryMap,
    monthlySpend: monthlyMap,
    recentExpenses: expenses.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate)).slice(0, 10),
  };
};

module.exports = {
  buildUserAnalytics,
};
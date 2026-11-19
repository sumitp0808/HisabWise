const groupParameters = {
  type: "object",
  properties: {
    groupId: { type: "string", description: "The group ID returned by getUserGroups." },
    groupName: { type: "string", description: "The exact group name when its ID is not known." },
  },
};

const declarations = [
  {
    name: "getUserGroups",
    description: "List the authenticated user's groups, including the user's signed balance in each group.",
    parametersJsonSchema: { type: "object", properties: {} },
  },
  {
    name: "getGroupDetails",
    description: "Get details for one of the authenticated user's groups, including members, currency, total expenses, and the user's balance.",
    parametersJsonSchema: groupParameters,
  },
  {
    name: "getGroupBalance",
    description: "Get the authenticated user's exact current balance in a group. Negative means the user owes money; positive means money is owed to the user.",
    parametersJsonSchema: groupParameters,
  },
  {
    name: "getAllBalances",
    description: "Summarize what the authenticated user owes and is owed across all groups, keeping currencies separate, and identify people who currently owe money directly to the user.",
    parametersJsonSchema: { type: "object", properties: {} },
  },
  {
    name: "getUserExpenses",
    description: "List expenses the authenticated user participated in, optionally filtered by group, category, date range, and limit.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        ...groupParameters.properties,
        category: { type: "string" },
        startDate: { type: "string", description: "Inclusive date in YYYY-MM-DD format." },
        endDate: { type: "string", description: "Inclusive date in YYYY-MM-DD format." },
        limit: { type: "integer", description: "Maximum number of results, from 1 to 50." },
      },
    },
  },
  {
    name: "getHighestExpense",
    description: "Find the highest-amount expense the authenticated user participated in, optionally within one group.",
    parametersJsonSchema: groupParameters,
  },
  {
    name: "getRecentExpenses",
    description: "Get the authenticated user's most recent participated expenses, optionally within one group.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        ...groupParameters.properties,
        limit: { type: "integer", description: "Maximum number of results, from 1 to 20." },
      },
    },
  },
  {
    name: "getSpendingAnalytics",
    description: "Calculate the authenticated user's spending by category, month, and group. Monthly spending is based on the user's per-member share. Use month_over_month to compare this month with last month.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        ...groupParameters.properties,
        period: {
          type: "string",
          enum: ["this_month", "last_month", "all_time", "month_over_month"],
          description: "Optional analysis period; defaults to all_time.",
        },
        startDate: { type: "string", description: "Inclusive custom start date in YYYY-MM-DD format." },
        endDate: { type: "string", description: "Inclusive custom end date in YYYY-MM-DD format." },
      },
    },
  },
  {
    name: "getSettlementHistory",
    description: "List settlements involving the authenticated user in their groups, optionally filtered to one group.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        ...groupParameters.properties,
        limit: { type: "integer", description: "Maximum number of results, from 1 to 50." },
      },
    },
  },
];

module.exports = declarations;

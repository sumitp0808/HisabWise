const ai = require("../ai/gemini");
const { buildUserAnalytics } = require("../ai/analytics");

const chat = async (req, res) => {
try {

    const question = req.body.question;

    if (!question) {

      return res.status(400).json({
        message: "Question is required",
      });

    }

    console.log(req.user);
    const userEmail = req.user;

    const analytics = await buildUserAnalytics(userEmail);

    const prompt = `You are an AI financial assistant for an expense splitting application.Use ONLY the provided user data.

DATA of USER with email ${userEmail}:

Total Spent:
₹${analytics.totalSpent}

Total Groups:
${analytics.totalGroups}

Total Expenses:
${analytics.totalExpenses}

Top Spending Category:
${analytics.topCategory}

Category Wise Spend:
${JSON.stringify(
  analytics.categoryWiseSpend,
  null,
  2
)}

Monthly Spend:
${JSON.stringify(
  analytics.monthlySpend,
  null,
  2
)}

Recent Expenses:
${JSON.stringify(
  analytics.recentExpenses,
  null,
  2
)}

USER QUESTION:
${question}

Provide:
1. Direct answer.
2. Helpful explanation.
3. Any useful financial insight.
`;

    const response = await ai.models.generateContent({model: "gemini-2.5-flash", contents: prompt});

    return res.status(200).json({
      answer: response.text,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  chat,
};
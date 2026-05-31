const model = require("../models");

const validator = require("../utils/validation");


// Add Expense
exports.addExpense = async (req, res) => {

  try {

    const expense = req.body;

    // Check Group Exists
    const group = await model.Group.findOne({
      _id: expense.groupId,
    });

    if (!group) {

      return res.status(400).json({
        message: "Invalid Group Id",
      });

    }


    // Validations
    validator.notNull(expense.expenseName);
    validator.notNull(expense.expenseAmount);
    validator.notNull(expense.expenseOwner);
    validator.notNull(expense.expenseMembers);


    // Validate Owner
    const ownerValidation =
      await validator.groupUserValidation(
        expense.expenseOwner,
        expense.groupId
      );

    if (!ownerValidation) {

      return res.status(400).json({
        message: "Invalid Expense Owner",
      });

    }


    // Validate Members
    for (const user of expense.expenseMembers) {

      const memberValidation =
        await validator.groupUserValidation(
          user,
          expense.groupId
        );

      if (!memberValidation) {

        return res.status(400).json({
          message:
            "One or more members not present in group",
        });

      }
    }


    // Calculate Per Member Expense
    expense.expensePerMember =
      expense.expenseAmount /
      expense.expenseMembers.length;

    expense.expenseCurrency =
      group.groupCurrency;


    // Save Expense
    const newExp = new model.Expense(expense);
    const newExpense = await model.Expense.create(newExp);


    // Update Group Total
    group.groupTotal += expense.expenseAmount;

    await group.save();


    res.status(201).json({
      status: "Success",
      message: "Expense Added Successfully",
      expense: newExpense,
    });

  } catch (error) {

    res.status(error.status || 500).json({
      message: error.message,
    });

  }
};



// Get Single Expense
exports.getExpense = async (req, res) => {

  try {

    const expense =
      await model.Expense.findById(
        req.params.id
      );

    if (!expense) {

      return res.status(404).json({
        message: "Expense Not Found",
      });

    }

    res.status(200).json({
      status: "Success",
      expense,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// Get Group Expenses
exports.getGroupExpenses = async (
  req,
  res
) => {

  try {

    const expenses =
      await model.Expense.find({
        groupId: req.params.groupId,
      }).sort({
        expenseDate: -1,
      });

    res.status(200).json({
      status: "Success",
      count: expenses.length,
      expenses,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// Get User Expenses
exports.getUserExpenses = async (
  req,
  res
) => {

  try {

    const expenses =
      await model.Expense.find({
        expenseMembers: req.user,
      }).sort({
        expenseDate: -1,
      });

    res.status(200).json({
      status: "Success",
      count: expenses.length,
      expenses,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// Edit Expense
exports.editExpense = async (req, res) => {

  try {

    const expense =
      await model.Expense.findById(
        req.params.id
      );

    if (!expense) {

      return res.status(404).json({
        message: "Expense Not Found",
      });

    }

    const updatedExpense =
      await model.Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json({
      status: "Success",
      message: "Expense Updated",
      expense: updatedExpense,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// Delete Expense
exports.deleteExpense = async (
  req,
  res
) => {

  try {

    const expense =
      await model.Expense.findById(
        req.params.id
      );

    if (!expense) {

      return res.status(404).json({
        message: "Expense Not Found",
      });

    }


    // Reduce Group Total
    const group =
      await model.Group.findById(
        expense.groupId
      );

    if (group) {

      group.groupTotal -=
        expense.expenseAmount;

      await group.save();
    }


    await model.Expense.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      status: "Success",
      message: "Expense Deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
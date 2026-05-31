const express = require('express');
const expenseController = require('../controllers/expense.controller')

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//Add Expense router
router.post('/v1/add', expenseController.addExpense)

//Edit group router 
router.post('/v1/edit', expenseController.editExpense)

//Delte group router
router.delete('/v1/delete', expenseController.deleteExpense)

//View Individual expense router
router.post('/v1/view', expenseController.viewExpense)

//View group expense router
router.post('/v1/group', expenseController.viewGroupExpense)

//View user expense router 
router.post('/v1/user', expenseController.viewUserExpense)

//View user recent expense router
router.post('/v1/user/recent', expenseController.recentUserExpenses)

//Get group category expense router
router.post('/v1/group/categoryExp', expenseController.groupCategoryExpense)

//Get user category expense router
router.post('/v1/user/categoryExp', expenseController.userCategoryExpense)

//Get group monthly expense router 
router.post('/v1/group/monthlyExp', expenseController.groupMonthlyExpense)

//Get group daily expesnse router 
router.post('/v1/group/dailyExp', expenseController.groupDailyExpense)

//Get user monthly expense router 
router.post('/v1/user/monthlyExp', expenseController.userMonthlyExpense)

//Get user daily expense router 
router.post('/v1/user/dailyExp', expenseController.userDailyExpense)


module.exports = router;
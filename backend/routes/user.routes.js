var express = require('express');
var userController = require('../controllers/user.controller')
var apiAuth = require('../middleware/apiAuthentication')

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//User Registeration router
router.post('/v1/register', userController.userReg)

//User Login router 
router.post('/v1/login', userController.userLogin)

//View User router 
router.post('/v1/view', apiAuth.validateToken,userController.viewUser)

//Edit User router
router.post('/v1/edit', apiAuth.validateToken, userController.editUser)

//Delete User router 
router.delete('/v1/delete', apiAuth.validateToken,userController.deleteUser)

//Update Password router
router.post('/v1/updatePassword',apiAuth.validateToken, userController.updatePassword)

//Get all User Emalil Id 
router.get('/v1/emailList',apiAuth.validateToken, userController.emailList)

module.exports = router;
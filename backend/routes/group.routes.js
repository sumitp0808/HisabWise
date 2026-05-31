const express = require('express');
const groupController = require('../controllers/group.controller')

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource')
})

//Add Group router
router.post('/v1/add', groupController.createGroup)

//View Group router 
router.post('/v1/view', groupController.viewGroup)

//View User groups router
router.post('/v1/user', groupController.findUserGroup)

//Edit group router
router.post('/v1/edit', groupController.editGroup)

//Settlement Calculator router 
router.post('/v1/settlement', groupController.groupBalanceSheet)

//Make settlement router 
router.post('/v1/makeSettlement', groupController.makeSettlement)

//Delte group router
router.delete('/v1/delete', groupController.deleteGroup)

module.exports = router;
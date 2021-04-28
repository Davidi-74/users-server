const express = require('express')
const router = express.Router();
const userBL = require('../models/userBL')

// get all
// router.route('/').get(async (req, resp) => {
//     let users = await userBL.getAll();
//     return resp.json(users);
// })

// get by ID 
router.route('/getById/:id').get(async (req, resp) => {
    let id = req.params.id;
    let user = await userBL.getById(id);
    return resp.json(user);
})

// create
router.route('/').post(async (req, resp) => {
    let newUser = req.body;
    let newUserId = await userBL.createUserInDB(newUser.username);
    let data = await userBL.createUserInJSONFile(newUser, newUserId);
    return resp.json(data);
})

// update
router.route('/OGUpdate/:id').put(async (req, resp) => {
    let id = req.params.id;
    let user = req.body;
    let data = await userBL.updateUser(id, user);
    return resp.json(data);
})

router.route('/:id').put(async (req, resp) => {
    let id = req.params.id;
    let user = req.body;
    let data = await userBL.updateUserAndJFileData(id, user);
    return resp.json(data);
})

// delete
router.route('/:id').delete(async (req, resp) => {
    let id = req.params.id;
    let data = await userBL.deleteUserAndJFileData(id);
    return resp.json(data);
})

router.route('/OGDelete/:id').delete(async (req, resp) => {
    let id = req.params.id;
    let data = await userBL.deleteUser(id);
    return resp.json(data);
})

// checkLogin
router.route('/checkLogin/:username/:pwd').get(async (req, resp) => {
    let username = req.params.username;
    let pwd = req.params.pwd;
    let valid = await userBL.checkLogin(username, pwd);
    return resp.json(valid);
})

// get First Name
router.route('/getFname/:id').get(async (req, resp) => {
    let id = req.params.id;
    let fname = await userBL.getFname(id);
    return resp.json(fname);
})

// created by admin
router.route('/createdByAdmin/:username/:pwd').get(async (req, resp) => {
    let username = req.params.username;
    let pwd = req.params.pwd;
    let check = await userBL.createdByAdmin(username, pwd);
    return resp.json(check)
})

router.route('/getLoginData/:id').get(async (req, resp) => {
    let id = req.params.id;
    let user = await userBL.getLoginData(id);
    return resp.json(user);
})

router.route('/getAllUsersData').get(async (req, resp) => {
    let users = await userBL.getAllUsersData();
    return resp.json(users);
})

router.route('/getIndCompUserData/:id').get(async (req, resp) => {
    let id = req.params.id;
    let user = await userBL.getIndCompUserData(id);
    return resp.json(user);
})

router.route('/getAllUsersIDs').get(async (req, resp) => {
    let ids = await userBL.getAllUsersIDs();
    return resp.json(ids);
})

module.exports = router;
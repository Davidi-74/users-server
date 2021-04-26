const JFile = require('./JFile')
const User = require('./userSchema')

// get all users
const getAll = () => {
    return new Promise((res, rej) => {
        User.find({}, (err, users) => {
            if (err) {
                rej(err)
            }
            else {
                res(users)
            }
        })
    })
}

// get by ID
const getById = (id) => {
    return new Promise((res, rej) => {
        User.findById(id, (err, user) => {
            if (err) {
                rej(err)
            }
            else {
                res(user)
            }
        })
    })
}

const createUserInDB = (username) => {
    return new Promise((res, rej) => {
        let newUser = new User({
            username: username,
            password: -1
        })
        newUser.save((err, user) => {
            if (err) {
                rej(err)
            }
            else {
                res(user._id)
            }
        })
    })
}

const createUserInJSONFile = (user, id) => {
    let resp = JFile.addUser(user, id);
    return resp;
}

const updateUser = (id, user) => {
    return new Promise((res, rej) => {
        User.findByIdAndUpdate(id, {
            username: user.username
        }, false, err => {
            if (err) {
                rej(err)
            }
            else {
                res("User Updated!")
            }
        })
    })
}

const updateUserAndPassword = (id, user) => {
    return new Promise((res, rej) => {
        User.findByIdAndUpdate(id, {
            username: user.username,
            password: user.password
        }, false, err => {
            if (err) {
                rej(err)
            }
            else {
                res("User Updated!")
            }
        })
    })
}

const updateUserInJSONFile = async (id, newUserData) => {
    let resp = await JFile.updateUser(id, newUserData);
    return resp;
}

const deleteUser = (id) => {
    return new Promise((res, rej) => {
        User.findByIdAndDelete(id, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("User Deleted!")
            }
        })
    })
}

const checkLogin = (username, pwd) => {
    return new Promise((res, rej) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                rej(err)
            }
            else if (user == null) {
                res({ valid: false, id: "" })
            }
            else {
                if (user.password == pwd) {
                    res({ valid: true, id: user.id })
                }
                else {
                    res({ valid: false, id: "" })
                }
            }
        })
    })
}

const getFname = async (id) => {
    let fname = await JFile.getFname(id);
    return fname;
}

const createdByAdmin = (un, pwd) => {
    return new Promise((res, rej) => {
        User.find({}, (err, users) => {
            if (err) {
                rej(err)
            }
            else {
                let created = false;
                let exists = false;
                users.forEach(user => {
                    if (un.toLowerCase() == user.username.toLowerCase() && user.password == "-1") {
                        created = true;
                        updateUserAndPassword(user._id, { username: un, password: pwd })
                    }
                    else if (un.toLowerCase() == user.username.toLowerCase()) {
                        exists = true;
                    }
                })
                if (exists) {
                    res("exists")
                }
                else {
                    res(created)
                }
            }
        })
    })
}

const getLoginData = async (id) => {
    let user = await JFile.loginData(id);
    return user;
}

const getAllUsersData = async () => {
    let usernames = await getAll();
    let data = [];
    for (const user of usernames) {
        let jfilesData = await JFile.getAllUsersDataFromJFiles(user._id);
        let obj = {
            id: user._id,
            username: user.username,
            fname: jfilesData.fname,
            lname: jfilesData.lname,
            sessionTimeout: jfilesData.sessionTimeout,
            dateCreated: jfilesData.dateCreated,
            permissions: jfilesData.permissions
        }
        data.push(obj);
    }
    return data;
}

const getIndCompUserData = async (id) => {
    let user = await getById(id);
    let jfilesData = await JFile.getAllUsersDataFromJFiles(id);
    let obj = {
        username: user.username,
        fname: jfilesData.fname,
        lname: jfilesData.lname,
        sessionTimeout: jfilesData.sessionTimeout,
        dateCreated: jfilesData.dateCreated,
        permissions: jfilesData.permissions
    }
    return obj;
}

const deleteUserAndJFileData = async (id) => {
    JFile.deleteUser(id);
    let resp = await deleteUser(id);
    return resp;
}

const updateUserAndJFileData = async (id, newUserData) => {
    await updateUserInJSONFile(id, newUserData);
    let resp = await updateUser(id, newUserData);
    return resp;
}

const getAllUsersIDs = async () => {
    let users = await getAll();
    let ids = users.map(user => { return user.id });
    return ids;
}


module.exports = {
    getAll, getById, createUserInDB, updateUser, deleteUser, checkLogin, getFname,
    createdByAdmin, getLoginData, getAllUsersData, createUserInJSONFile, getIndCompUserData,
    deleteUserAndJFileData, updateUserAndJFileData, getAllUsersIDs
}
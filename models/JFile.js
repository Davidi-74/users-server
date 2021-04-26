const jsonfile = require('jsonfile');

const getUsers = () => {
    return new Promise((res, rej) => {
        jsonfile.readFile('./configs/users.json', (err, data) => {
            if (err) {
                rej(err)
            }
            else {
                res(data.users)
            }
        })
    })
}

const getFname = async (id) => {
    let users = await getUsers();
    let fname = "";
    users.forEach(user => {
        if (user.id == id) {
            fname = user.fname;
        }
    })
    return fname;
}

const isFirst = async (id) => {
    let users = await getUsers();
    if (users[0].id == id) {
        return true;
    }
    else {
        return false;
    }
}

const getSessionTimeout = async (id) => {
    let users = await getUsers();
    let sessionTimeout = "";
    let user = users.filter(user => user.id == id);
    sessionTimeout = user[0].sessionTimeout;
    return sessionTimeout;
}

const loginData = async (id) => {
    let fname = await getFname(id);
    let admin = await isFirst(id);
    let permissions = await getPermissionsById(id);
    let sessionTimeout = await getSessionTimeout(id);
    let user = {
        fname: fname,
        admin: admin,
        permissions: permissions,
        sessionTimeout: sessionTimeout
    }
    return user;
}

const getPermissions = () => {
    return new Promise((res, rej) => {
        jsonfile.readFile('./configs/permissions.json', (err, data) => {
            if (err) {
                rej(err)
            }
            else {
                res(data.permissions)
            }
        })
    })
}

const getPermissionsById = async (id) => {
    let permissions = await getPermissions();
    let permById = permissions.filter(perm => perm.id == id);
    return permById[0].permissions;
}

const getAllUsersDataFromJFiles = async (id) => {
    let users = await getUsers();
    let userArr = users.filter(user => user.id == id);
    let userById = userArr[0];
    let permissions = await getPermissionsById(userById.id);
    let obj = {
        fname: userById.fname,
        lname: userById.lname,
        sessionTimeout: userById.sessionTimeout,
        dateCreated: userById.dateCreated,
        permissions: permissions
    }
    return obj;
}

const addUser = async (user, id) => {
    let currentUsers = await getUsers();
    addPermissions(user.permissions, id);
    return new Promise((res, rej) => {
        let newUser = {
            id: id,
            fname: user.fname,
            lname: user.lname,
            dateCreated: user.dateCreated,
            sessionTimeout: Number(user.sessionTimeout)
        }
        let newUsers = [...currentUsers];
        newUsers.push(newUser);
        let usersObj = { users: newUsers };
        jsonfile.writeFile('./configs/users.json', usersObj, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("User Created!")
            }
        })
    })
}

const addPermissions = async (permissions, id) => {
    let currentPerms = await getPermissions();
    return new Promise((res, rej) => {
        let obj = {
            id: id,
            permissions: permissions
        }
        let newPerms = [...currentPerms];
        newPerms.push(obj);
        let permsObj = { permissions: newPerms }
        jsonfile.writeFile('./configs/permissions.json', permsObj, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("Permissions Added")
            }
        })
    })
}

const deleteUser = async (id) => {
    let currentUsers = await getUsers();
    let target = -1;
    currentUsers.forEach((user, index) => {
        if (user.id == id) {
            target = index;
        }
    })
    let newUsers = [...currentUsers];
    newUsers.splice(target, 1);
    let usersObj = { users: newUsers };
    await deleteUserPermissions(id);
    return new Promise((res, rej) => {
        jsonfile.writeFile('./configs/users.json', usersObj, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("User Deleted!")
            }
        })
    })
}

const deleteUserPermissions = async (id) => {
    let currentPerms = await getPermissions();
    let target = -1;
    currentPerms.forEach((perm, index) => {
        if (perm.id == id) {
            target = index
        }
    });
    let newPerms = [...currentPerms];
    newPerms.splice(target, 1);
    let permsObj = { permissions: newPerms };
    return new Promise((res, rej) => {
        jsonfile.writeFile('./configs/permissions.json', permsObj, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("Permissions Deleted")
            }
        })
    })
}

const editPermissions = async (id, newPermsData) => {
    let currentPerms = await getPermissions();
    let target = -1;
    currentPerms.forEach((perm, index) => {
        if (perm.id == id) {
            target = index;
        }
    })
    let newPerms = [...currentPerms];
    newPerms[target].permissions = newPermsData;
    let permsObj = { permissions: newPerms }
    return new Promise((res, rej) => {
        jsonfile.writeFile('./configs/permissions.json', permsObj, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("Permissions Updated")
            }
        })
    })
}

const updateUser = async (id, newUserData) => {
    let currentUsers = await getUsers();
    let target = -1;
    currentUsers.forEach((user, index) => {
        if (user.id == id) {
            target = index;
        }
    })
    let newUsers = [...currentUsers];
    let obj = {
        id: id,
        fname: newUserData.fname,
        lname: newUserData.lname,
        dateCreated: newUserData.dateCreated,
        sessionTimeout: newUserData.sessionTimeout
    }
    newUsers[target] = obj;
    let usersObj = { users: newUsers };
    await editPermissions(id, newUserData.permissions)
    return new Promise((res, rej) => {
        jsonfile.writeFile('./configs/users.json', usersObj, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("User Updated!")
            }
        })
    })
}


module.exports = {
    getFname, isFirst, loginData, getUsers,
    getPermissionsById, getAllUsersDataFromJFiles, addUser, deleteUser,
    updateUser
}

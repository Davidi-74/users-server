const jsonfile = require('jsonfile');

const getUsers = () => {
    return new Promise((res, rej) => {
        jsonfile.readFile('./users.json', (err, data) => {
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

const loginData = async (id) => {
    let fname = await getFname(id);
    let admin = await isFirst(id);
    let user = {
        fname: fname,
        admin: admin
    }
    return user;
}

const getPermissions = () => {
    return new Promise((res, rej) => {
        jsonfile.readFile('./permissions.json', (err, data) => {
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
        createdDate: userById.createdDate,
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
        jsonfile.writeFile('./users.json', usersObj, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("User Created!")
            }
        })
    })
}
// let obj = {
//     fname: "asd",
//     lname: "asd",
//     dateCreated: "15/03/2021",
//     sessionTimeout: 123,
//     permissions: [
//         "View Movies",
//         "Create Movies",
//         "Delete Movies",
//         "View Subscriptions"
//     ]
// }
// addUser(obj, "60460fbe5a77951b702173a9")

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
        jsonfile.writeFile('./permissions.json', permsObj, (err) => {
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
        jsonfile.writeFile('./users.json', usersObj, (err) => {
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
        jsonfile.writeFile('./permissions.json', permsObj, (err) => {
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
        jsonfile.writeFile('./permissions.json', permsObj, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("Permissions Updated")
            }
        })
    })
}

const editUser = async (id, newUserData) => {
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
        jsonfile.writeFile('./users.json', usersObj, (err) => {
            if (err) {
                rej(err)
            }
            else {
                res("User Updated!")
            }
        })
    })
}




module.exports = { getFname, isFirst, loginData, getUsers, getPermissionsById, getAllUsersDataFromJFiles }

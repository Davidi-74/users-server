const mongoose = require('mongoose');

let userSchema = mongoose.Schema;

let User = new userSchema({
    username: String,
    password: String
})

module.exports = mongoose.model('users', User)
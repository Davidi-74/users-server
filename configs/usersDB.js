// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/usersDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
const mongoose = require('mongoose');

const uri = "mongodb+srv://davidi74:RJ6xWZhZsiYquUg@movies-proj-db.azp85.mongodb.net/usersDB?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
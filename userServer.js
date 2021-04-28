const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());

require('./configs/usersDB');

const usersController = require('./controllers/usersController')

app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());

app.use('/users', usersController)

app.listen(process.env.PORT || 8001);
console.log("Server is up!");
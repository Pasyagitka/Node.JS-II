const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

require('./routes/token.routes')(app);
app.use((req, res) => res.status(404).send('Not found'));

app.listen(3000, ()=> console.log('Server started')); 

module.exports = app;
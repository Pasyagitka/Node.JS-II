const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {AbilityBuilder, Ability} = require('casl');
const defineAbilityFor = require('./abilities').defineAbilityFor;
const authenticateToken = require('./controllers/auth').authenticateToken;
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

var unless = function(path, middleware) {
    return function(req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};


require('./routes/auth')(app);

//app.use(unless('/api/ability', authenticateToken));
app.use(authenticateToken);


app.use((req, _, next) => {
    console.log('define',req.user);
    req.ability = defineAbilityFor(req.user);
    next();
});

require('./routes/api')(app);

app.use((_, res) => res.status(404).send('Not found'));

app.listen(3000, ()=> console.log('Server started')); 

module.exports = app;
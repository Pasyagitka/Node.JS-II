const express = require("express");
const winston = require('winston');
const passport = require('passport');
const basicStrategy = require('passport-http').BasicStrategy;
let trusted = require('./trusted.json');
let {getCredential, verificatePassword} = require('./verify.js');

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
      new winston.transports.Console({ level: 'info' }),
      new winston.transports.File({
        filename: 'combined.log',
        level: 'info'
      })
    ],
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
    )
});

const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: '12345'
});
//curl -v --user liza:123 --basic http://127.0.0.1:3000/

const app = express();

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


passport.use(new basicStrategy((user, password, done) => {
    let credential = getCredential(trusted, user);
    if(!credential) return done(null, false, {message: 'Wrong username'});
    if(!verificatePassword(credential.password, password)) return done(null, false, {message: 'Wrong password'});
    return done(null, user, {message: 'Success'});
}));

passport.serializeUser((user, done)=> {
    console.log('SerializeUser');
    done(null, user);
});

passport.deserializeUser((user, done)=> {
    logger.log('info', 'DeserializeUser');
    done(null, user);
});


require("./routes/basic.routes")(app);
app.use((req, res) => res.status(404).send("Not found"));

app.listen(3000, ()=> console.log('Server started')); 

module.exports = app;
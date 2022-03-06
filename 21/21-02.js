const express = require("express");
const passport = require('passport');
const digestStrategy = require('passport-http').DigestStrategy;
let trusted = require('./trusted.json');
let {getCredential} = require('./verify.js');

const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: '12345'
});

const app = express();

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


passport.use(new digestStrategy({qop:'auth'}, (user, done) => {
    let rc = null;
    let credential = getCredential(trusted, user);
    console.log(credential)
    if(!credential) rc = done(null, false);
    else rc = done(null, credential.login, credential.password);
    return rc;
}, (params, done) => {
    console.log('params', params);
    done(null, true);
}));

passport.serializeUser((user, done)=> {
    console.log('SerializeUser');
    done(null, user);
});

passport.deserializeUser((user, done)=> {
    console.log('DeserializeUser');
    done(null, user);
});


require("./routes/digest.routes")(app);
app.use((req, res) => res.status(404).send("Not found"));

app.listen(3000, ()=> console.log('Server started')); 

module.exports = app;
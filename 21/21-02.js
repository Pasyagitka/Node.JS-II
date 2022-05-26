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
//app.use(passport.session());
app.use(express.json());


passport.use(new digestStrategy({qop:'auth'}, (user, done) => {
    let credential = getCredential(trusted, user);
    if(!credential) return done(null, false);
    else return done(null, credential.login, credential.password);
}, (params, done) => {
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
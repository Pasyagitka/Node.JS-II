const express = require("express");
const passport = require('passport');
const basicStrategy = require('passport-http').BasicStrategy;
let trusted = require('./trusted.json');
let {getCredential, verificatePassword} = require('./verify.js');


const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: '12345'
});
//curl -v --user pasyagitka:123 --basic http://127.0.0.1:3000/

const app = express();

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


passport.use(new basicStrategy((user, password, done) => {
    let rc = null;
    let credential = getCredential(trusted, user);
    if(!credential) {
      rc = done(null, false, {message: 'Wrong user name'});
    }
    else if(!verificatePassword(credential.password, password)) {
      rc = done(null, false, {message: 'Wrong user password'});
    }
    else  {
      rc = done(null, user, {message: 'All ok'});
    }
    return rc;
}));

passport.serializeUser((user, done)=> {
    console.log('SerializeUser');
    done(null, user);
});

passport.deserializeUser((user, done)=> {
    console.log('DeserializeUser');
    done(null, user);
});


require("./routes/basic.routes")(app);
app.use((req, res) => res.status(404).send("Not found"));

app.listen(3000, ()=> console.log('Server started')); 

module.exports = app;
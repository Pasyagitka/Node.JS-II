const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const cp = require('cookie-parser');
let trusted = require('./trusted.json');

const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: '12345'
});

const app = express();

app.use(session);
app.use(cp());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

passport.use(new localStrategy({
    usernameField: 'login',
    passwordField: 'password',
    session: true
  }, (user, password, done) => {
    let credential = trusted.find(u => u.login.toLowerCase() === user.toLowerCase());
    if(!credential) return done(null, false, {message: 'Wrong username'});
    if((credential.password !== password)) return done(null, false, {message: 'Wrong password'});
    return done(null, user, {message: 'Success'});
}));

passport.serializeUser((user, done) => {
    console.log('SerializeUser');
	done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('DeserializeUser');
	done(null, user);
});

require('./routes/forms.routes')(app);
app.use((req, res) => res.status(404).send('Not found'));

app.listen(3000, ()=> console.log('Server started')); 

module.exports = app;
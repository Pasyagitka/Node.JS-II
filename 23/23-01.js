const app = require('express')();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
require('dotenv').config();

const session = require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: '12345',
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback',
  },
  (token, refreshToken, profile, done) => done(null, { profile, token }),
));

passport.serializeUser((user, done) => {
  console.log('serialize', user.profile.displayName);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('deserialize ', user.profile.displayName);
  done(null, user);
});

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => { 
    res.sendFile(`${__dirname}/login.html`); 
});

app.get('/auth/github',	passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/resource');
  },
);

app.get('/resource', (req, res) => {
  if (req.user) {
    res.send(
      `Resource: ${req.user.profile.id}, ${req.user.profile.displayName}`,
    );
  } else {
    res.redirect(401, '/login');
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.use((req, res) => res.status(404).send('Not found'));

app.listen(3000, () => console.log('Server is running on http://localhost:3000/'));

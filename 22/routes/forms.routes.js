const passport = require('passport');
let router = require('express').Router();
const controller = require('../controllers/forms.controller.js');

module.exports = app => {
    router.get('/login', controller.returnForm);
    router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => res.redirect('/resource'));
    router.get('/logout', controller.logout);
    router.get('/resource', controller.resource);

    app.use('/', router);
};
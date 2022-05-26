let router = require('express').Router();
const controller = require('../controllers/auth');

module.exports = app => {
    router.get('/login', controller.returnLoginForm);
    router.post('/login', controller.login);
    router.get('/register', controller.returnRegisterForm);
    router.post('/register', controller.register);
    router.get('/logout', controller.logout);
    app.use('/', router);
};
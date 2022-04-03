let router = require('express').Router();
const controller = require('../controllers/token.controller.js');

module.exports = app => {
    router.get('/login', controller.returnLoginForm);
    router.post('/login', controller.login);
    router.get('/logout', controller.logout);
    router.get('/register', controller.returnRegisterForm);
    router.post('/register', controller.register);
    router.get('/refresh-token', controller.refreshToken, controller.resource);
    router.get('/resource', controller.authenticateToken, controller.resource);

    app.use('/', router);
};
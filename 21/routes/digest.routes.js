const passport = require('passport');
let router = require("express").Router();
const controller = require("../controllers/controller.js");

module.exports = app => {
    router.get("/login", controller.login,  passport.authenticate('digest', {session: false}), controller.setLogout, controller.loginSuccess);
    router.get("/logout", controller.logout);
    router.get("/resource", controller.resource);

    app.use('/', router);
};
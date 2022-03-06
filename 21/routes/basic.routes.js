const passport = require('passport');
let router = require("express").Router();
const controller = require("../controllers/controller.js");

module.exports = app => {
    router.get("/login", controller.loginFirst,  passport.authenticate('basic'), controller.loginSecond, controller.loginThird);
    router.get("/logout", controller.logout);
    router.get("/resource", controller.resource);

    app.use('/', router);
};
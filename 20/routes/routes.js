module.exports = app => {
    const controller = require("../controller/controller.js");
    let router = require("express").Router();
  
    router.get("/", controller.findAll);
    router.get("/add", controller.add);
    router.get("/update/:name", controller.upd);
    router.post("/add", controller.create);
    router.post("/update/:name", controller.update);
    router.post("/add", controller.create);
    router.post("/delete/:name", controller.delete);

    app.use('/', router);
};
module.exports = app => {
    const controller = require("../controller");
    let router = require("express").Router();
  
    router.get("/", controller.findAll);
    router.post("/", controller.create);
    router.put("/", controller.update);
    router.delete("/", controller.delete);

    app.use('/TS', router);
};
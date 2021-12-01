const express = require("express");
const trophy = require("../controllers/trophy.controller");
const middlewares = require("../middlewares");

module.exports = app => {
    const router = express.Router();

    router.use(middlewares.verifyToken);

    router.post("/", trophy.create);
    router.get("/:testId", trophy.findAll);

    app.use("/api/trophy", router);
};

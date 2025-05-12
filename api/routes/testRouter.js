const express = require("express");
const testRouter = express.Router();
const testCtrl = require("../controllers/testCtrl");

testRouter.get("/test", testCtrl.base);

module.exports = testRouter;

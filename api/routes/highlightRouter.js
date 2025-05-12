const express = require("express");
const highlightRouter = express.Router();
const highlightCtrl = require("../controllers/highlightCtrl");
const auth = require('../middlewares/auth')

highlightRouter.post("/highlight/create",auth, highlightCtrl.createHighlight);
highlightRouter.patch("/highlight/update/:id",auth, highlightCtrl.updateHighlight);
highlightRouter.delete("/highlight/delete/:id", auth, highlightCtrl.deleteHighlight);
highlightRouter.get("/highlight/user/:id",auth, highlightCtrl.getUserHighlights);

module.exports = highlightRouter;

const express = require('express')
const storyRouter = express.Router()

const storyCtrl = require('../controllers/storyCtrl')
const auth = require("../middlewares/auth");

storyRouter.get("/stories",auth, storyCtrl.getFeedStories);
storyRouter.post("/story/create",auth, storyCtrl.createStory);
storyRouter.delete("/story/delete/:id", auth, storyCtrl.deleteStory);
storyRouter.get("/story/archive", auth, storyCtrl.getArchiveStories);
storyRouter.get("/story/user/:id", auth, storyCtrl.getProfileStories);

storyRouter.patch("/story/:id/view",auth, storyCtrl.viewStory);
storyRouter.patch("/story/:id/heart",auth, storyCtrl.heartStory);
storyRouter.patch("/story/:id/removeheart",auth, storyCtrl.removeHeartStory);


module.exports = storyRouter;

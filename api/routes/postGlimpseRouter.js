const express = require('express')
const postGlimpseRouter = express.Router()
const postGlimpseCtrl = require('../controllers/postGlimpseCtrl')
const auth = require("../middlewares/auth");

postGlimpseRouter.post("/post-glimpse/create",auth, postGlimpseCtrl.createPostGlimpse);
postGlimpseRouter.patch("/post-glimpse/update/:id/", auth, postGlimpseCtrl.updatePostGlimpse);
postGlimpseRouter.delete("/post-glimpse/delete/:id", auth, postGlimpseCtrl.deletePostGlimpse);

postGlimpseRouter.get("/post-glimpse/saves", auth, postGlimpseCtrl.getSavePostsGlimpses);
postGlimpseRouter.get("/post-glimpse/feed",auth, postGlimpseCtrl.getFeedPostsGlimpses);

postGlimpseRouter.get("/post-glimpse/get/:id", auth, postGlimpseCtrl.getPostGlimpseById);
postGlimpseRouter.get("/post-glimpse/glimpse/:id", auth, postGlimpseCtrl.getGlimpseById);
postGlimpseRouter.get("/post-glimpse/post/:id", auth, postGlimpseCtrl.getPostById);
postGlimpseRouter.patch('/post-glimpse/like/:id', auth, postGlimpseCtrl.likePostGlimpse)
postGlimpseRouter.patch('/post-glimpse/removelike/:id', auth, postGlimpseCtrl.removeLikePostGlimpse)
postGlimpseRouter.patch('/post-glimpse/save/:id', auth, postGlimpseCtrl.savePostGlimpse)
postGlimpseRouter.patch('/post-glimpse/removesave/:id', auth, postGlimpseCtrl.removeSavePostGlimpse)

postGlimpseRouter.get("/post-glimpse/posts/random", auth, postGlimpseCtrl.getExplorePosts);
postGlimpseRouter.get("/post-glimpse/glimpses/random", auth, postGlimpseCtrl.getExploreGlimpses);
postGlimpseRouter.get("/post-glimpse/glimpses/user/:id", auth, postGlimpseCtrl.getUserGlimpses);
postGlimpseRouter.get("/post-glimpse/posts/user/:id", auth, postGlimpseCtrl.getUserPosts);


module.exports = postGlimpseRouter;

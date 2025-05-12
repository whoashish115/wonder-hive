const express = require("express");
const userRouter = express.Router()
const userCtrl = require("../controllers/userCtrl")
const auth = require("../middlewares/auth")

userRouter.get('/user/search', auth, userCtrl.searchUsers)
userRouter.patch('/user/update', auth, userCtrl.updateUserProfle)
userRouter.patch('/user/note', auth, userCtrl.addNoteProfile).delete('/user/note', auth, userCtrl.deleteNoteProfile)
userRouter.get('/user/check/:username', userCtrl.checkUsername)
userRouter.get('/user/username/:username', auth, userCtrl.getProfileByUsername)
userRouter.get('/user_suggestions', auth, userCtrl.getUserSuggestions)
userRouter.get('/profile_suggestions/:id', auth, userCtrl.getProfileSuggestions)
userRouter.get('/user/:id', auth, userCtrl.getProfileById)
userRouter.patch('/user/:id/follow', auth, userCtrl.followRequestProfile)
userRouter.patch('/user/:id/follow/accept', auth, userCtrl.followRequestAcceptProfile)
userRouter.patch('/user/:id/follow/decline', auth, userCtrl.followRequestDeclineProfile)
userRouter.patch('/user/:id/unfollow', auth, userCtrl.unfollowUserProfile)
// userRouter.delete('/user/:id/delete/', auth, userCtrl.removeProfile)

module.exports = userRouter
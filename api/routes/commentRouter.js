const express = require('express')
const commentRouter = express.Router()
const commentCtrl = require('../controllers/commentCtrl')
const auth = require('../middlewares/auth')

commentRouter.post('/comment/create', auth, commentCtrl.createComment)
commentRouter.patch('/comment/update/:id', auth, commentCtrl.updateComment)

commentRouter.patch('/comment/:id/like', auth, commentCtrl.likeComment)
commentRouter.patch('/comment/:id/removelike', auth, commentCtrl.removeLikeComment)

commentRouter.delete('/comment/delete/:id', auth, commentCtrl.deleteComment)



module.exports = commentRouter
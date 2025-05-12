const messageRouter = require('express').Router()
const messageCtrl = require('../controllers/messageCtrl')
const auth = require('../middlewares/auth')

messageRouter.post('/message/create', auth, messageCtrl.createMessage)
messageRouter.get('/message/conversation/:id', auth, messageCtrl.getMessages)
messageRouter.delete('/message/delete/:ref/:id', auth, messageCtrl.deleteMessage)

module.exports = messageRouter
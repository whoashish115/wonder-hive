const conversationRouter = require('express').Router()
const conversationCtrl = require('../controllers/conversationCtrl')
const auth = require('../middlewares/auth')

conversationRouter.post('/conversation/create', auth, conversationCtrl.createConversation)
conversationRouter.get('/conversations/get', auth, conversationCtrl.getConversations)
conversationRouter.delete('/conversation/:id', auth, conversationCtrl.deleteConversation)

module.exports = conversationRouter
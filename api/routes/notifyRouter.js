const notifyRouter = require('express').Router()
const auth = require('../middlewares/auth')
const notifyCtrl = require('../controllers/notifyCtrl')

notifyRouter.get('/notify/all', auth, notifyCtrl.getAllNotify)

notifyRouter.post('/notify/create', auth, notifyCtrl.createNotify)
notifyRouter.patch('/notify/read-all', auth, notifyCtrl.readAllNotify)

notifyRouter.delete('/notify/id/:id', auth, notifyCtrl.removeNotify)
notifyRouter.delete('/notify/all', auth, notifyCtrl.removeAllNotify)

module.exports = notifyRouter
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'user' },
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    text: String,
    medias: Array,
    call: Object,
    type:{type:String, default:'chat'},
    seenBy: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    removedFrom: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    deleted: { type: Boolean, default:false },

}, {
    timestamps: true
})

module.exports = mongoose.model('message', messageSchema)
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    postGlimpseId: mongoose.Types.ObjectId,
    postGlimpseUserId: mongoose.Types.ObjectId,
    deleted: { type: Boolean, default:false },

}, {
    timestamps: true
})

module.exports = mongoose.model('comment', commentSchema)
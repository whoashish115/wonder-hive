const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel');
const APIfeatures = require('../utils/features');

const messageCtrl = {
    createMessage: async (req, res) => {
        try {
            const { sender, recipients, conversation, text, medias, call } = req.body
            if (!recipients.length || (!text.trim() && medias.length === 0 && !call)) return;
            const newMessage = new Messages({
                conversation,
                sender, call,
                recipients, text, medias, seenBy: [req.user._id]
            })
            await newMessage.save()

            await Conversations.findOneAndUpdate({
                _id: conversation
            }, {
                $inc: {
                    ...recipients.map((r) => { return [`unseenMessagesCount.${r}`] }).reduce((acc, reci) => {
                        acc[reci] = 1;
                        return acc;
                    },{}),
                    ...[...recipients.filter(r=>r!==sender), sender].map((r) => { return [`messagesCount.${r}`] }).reduce((acc, reci) => {
                        acc[reci] = 1;
                        return acc;
                    },{})
                },
                [`unseenMessagesCount.${sender}`]: 0,
                endMessage: text ? text : (medias.length === 0 ? 'media' : (call ? 'call' : '')), endMessageDate:newMessage.createdAt,
                $pull: {
                    removedFrom: { $in: recipients }
                }
            }, { new: true })
            res.json({ message: 'Create Success!', newMessage })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getMessages: async (req, res) => {
        try {
            const features = new APIfeatures(Messages.find({
                conversation: req.params.id,
                removedFrom: { $nin: [req.user._id] }
            }), req.query).paginating()

            const messages = await features.query.sort('-createdAt')

            res.json({
                messages,
                result: messages.length
            })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    deleteMessage: async (req, res) => {
        try {
            const messages = await Messages.find({conversation:req.params.ref}).limit(2).sort('-createdAt')
            const conversation = await Conversations.findOne({_id: req.params.ref})
            if(messages.length==1){
                 await Conversations.findOneAndUpdate({
                _id: req.params.ref,
            },
                {
                    $inc:{
                        ...conversation.members.map((r) => { return [`messagesCount.${r}`] }).reduce((acc, reci) => {
                            acc[reci] = -1;
                            return acc;
                        },{}),
                        ...conversation.members.map((r) => { return [`unseenMessagesCount.${r}`] }).reduce((acc, reci) => {
                            if(conversation[reci] >0){
                                acc[reci] = -1;
                            }
                            else{
                                acc[reci] = 0;
                            }
                            return acc;
                        },{})
                    },
                    endMessage:null,
                    endMessageDate:null,
                }, { new: true })
            }
            else if (messages[0]._id == req.params.id ){
                await Conversations.findOneAndUpdate({
                    _id: req.params.ref,
                },
                    {
                        $inc:{
                            ...conversation.members.map((r) => { return [`messagesCount.${r}`] }).reduce((acc, reci) => {
                                acc[reci] = -1;
                                return acc;
                            },{}),
                            ...conversation.members.map((r) => { return [`unseenMessagesCount.${r}`] }).reduce((acc, reci) => {
                                if(conversation[reci] >0){
                                    acc[reci] = -1;
                                }
                                else{
                                    acc[reci] = 0;
                                }
                                return acc;
                            },{})
                        },
                        endMessage: messages[1].text ? messages[1].text : (messages[1].medias.length === 0 ? 'media' : (messages[1].call ? 'call' : '')), endMessageDate: messages[1].createdAt,
                    }, { new: true })
            }
            else{
            await Conversations.findOneAndUpdate({
                _id: req.params.ref,
            },
                {
                    $inc:{
                        ...conversation.members.map((r) => { return [`messagesCount.${r}`] }).reduce((acc, reci) => {
                            acc[reci] = -1;
                            return acc;
                        },{}),
                        ...conversation.members.map((r) => { return [`unseenMessagesCount.${r}`] }).reduce((acc, reci) => {
                            if(conversation[reci] >0){
                                acc[reci] = -1;
                            }
                            else{
                                acc[reci] = 0;
                            }
                            return acc;
                        },{})
                    }
                }, { new: true })
            }
            await Messages.findOneAndDelete({ _id: req.params.id, sender: req.user._id })
            res.json({ message: 'Delete Success!' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
}


module.exports = messageCtrl
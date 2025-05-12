const auth = require('../middlewares/auth');
const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel');
const APIfeatures = require('../utils/features');

const conversationCtrl = {
    createConversation: async (req, res) => {
        try {
            const { members, isGroup, title, picture } = req.body
            if (members.length < 1) return res.status(500).json({ error: "Atleast one member is required" })
            if (!isGroup) {
                const isAlreadyExistConversation = await Conversations.findOne({
                    $or: [
                       { members:members.length > 1 ? [members[0], members[1]] : members},
                       { members:members.length  > 1 ? [members[1], members[0]] : members},
                    ], isGroup:false
                })
                if (isAlreadyExistConversation) {
                    if (isAlreadyExistConversation.removedFrom.includes(req.user._id)) {
                        const newConversation = await Conversations.findOneAndUpdate({
                            $or: [
                                { members:members.length > 1 ? [members[0], members[1]] : members},
                                { members:members.length  > 1 ? [members[1], members[0]] : members},
                             ], isGroup:false
                        },
                            { $pull: { removedFrom: req.user._id } },{new:true}
                        )
                        return res.json({ message: 'Already Present!', conversation: {...newConversation._doc } })
                    } else {
                        return res.json({ message: 'Already Present!', conversation: {...isAlreadyExistConversation._doc} })
                    }
                }
            }
            if (isGroup) {
                if (title.length == 0) return res.status(500).json({ error: "title is required" })
                if (members.length < 2) return res.status(500).json({ error: "Atleast two members is required" })
                const conversation = new Conversations({
                    members,
                    isGroup: true,
                    admins: [req.user._id],
                    creator: req.user._id,
                    title,
                    picture,
                    bio,
                    unseenMessagesCount: {
                        ...members.reduce((acc, reci) => {
                            acc[reci] = 0;
                            return acc;
                        }, {}),
                    },
                    endMessage: `${req.user.username} created group ${title}`, endMessageDate: new Date(),
                    messagesCount: {
                        ...members.reduce((acc, rec) => {
                            acc[rec] = 1;
                            return acc 
                        }, {}),
                    },
                },)
                await conversation.save()

                const messageLabel = new Messages({
                    conversation: conversation._id,
                    sender: req.user._id, recipients: members.filter(m => m !== req.user._id),
                    type: 'label',
                    text: `${req.user.username} created group '${title}'`,
                    seenBy: [req.user._id]
                })
                await messageLabel.save()
                return res.json({ message: 'Create Success!', conversation, newMessage: messageLabel })
            }
            else {
                const conversation = new Conversations({
                    members,
                    admins: isGroup ? [req.user._id] : members,
                    creator: req.user._id,
                    unseenMessagesCount: {
                        ...members.reduce((acc, reci) => {
                            acc[reci] = 0;
                            return acc;
                        }, {})
                    },
                    messagesCount: {
                        ...members.reduce((acc, reci) => {
                            acc[reci] = 0;
                            return acc;
                        }, {})
                    },
                })
                await conversation.save()
                return res.json({ message: 'Create Success!', conversation })
            }

        } catch (error) {
            return res.status(500).json({ error: error.conversation })
        }
    },
    getConversations: async (req, res) => {
        try {
            const features = Conversations.find({
                members: req.user._id,
                [`messagesCount.${req.user._id}`]: { "$gt": 0 },
                removedFrom:{$nin:[req.user._id]}
            })
            const conversations = await features.sort('-updatedAt').populate('members creator admins', '-password')
            res.json({
                conversations,
            })

        } catch (error) {
            return res.status(500).json({ error: error.conversation })
        }
    },
    deleteConversation: async (req, res) => {
        try {
            await Conversations.findOneAndUpdate({
                _id: req.params.id,
            },
                {
                    $push: {
                        removedFrom: req.user._id
                    },
                    [`messagesCount.${req.user._id}`]: 0,
                }, { new: true })

            await Messages.updateMany({ conversation: req.params.id }, {
                $push: {
                    removedFrom: req.user._id
                }
            },  {new: true })

            res.json({ message: 'Delete Success!' })
        } catch (error) {
            return res.status(500).json({ error: error.conversation })
        }
    },
}


module.exports = conversationCtrl
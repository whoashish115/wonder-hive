let users = []
const Users = require("../models/userModel");
const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel');

const SocketServer = (socket) => {
    socket.on('joinUser', user => {
        users.push({ id: user._id, socketId: socket.id, ...user })
    })

    socket.on('disconnect', async () => {
        const myClient = users.find(user => user.socketId === socket.id)
        if (myClient) {
            const otherClients = users.filter(user => myClient.followers.find(item => item._id === user._id))

            if (otherClients.length > 0) {
                otherClients.forEach(otherClient => {
                    socket.to(`${otherClient.socketId}`).emit('activityOnlineOffline', myClient)
                })
            }
            await Users.findOneAndUpdate({ _id: myClient._id }, { lastActive: new Date() }, { new: true })

            // const editData = require("../utils/modules")
            // if (userData.call) {
            //     const callUser = users.find(user => user._id === userData.call)
            //     if (callUser) {
            //         users = editData(users, callUser._id, null)
            //         socket.to(`${callUser.socketId}`).emit('callerDisconnect')
            //     }
            // }
        }

        users = users.filter(user => user.socketId !== socket.id)
    })
   
    socket.on('storyUpdate', newStory => {
            const clients = users.filter(user => [...newStory.user.followers, newStory.user._id].includes(user._id))
            if (clients.length > 0) clients.forEach(client => { socket.to(`${client.socketId}`).emit('storyUpdateToClient', newStory) })
            })
    socket.on('authUserUpdate', authUser => {
        const followersList =  authUser.followers.map(u=>u._id) 
            const clients = users
            if (clients.length > 0) clients.forEach(client => { socket.to(`${client.socketId}`).emit('authUserUpdateToClient', authUser) })
            })
    socket.on('postGlimpseUpdate', newPostGlimpse => {
            const clients = users.filter(user => [...newPostGlimpse.user.followers, newPostGlimpse.user._id].includes(user._id))
        if (clients.length > 0) clients.forEach(client => { socket.to(`${client.socketId}`).emit('postGlimpseUpdateToClient', newPostGlimpse) })
        })
    socket.on('userUpdate', newUser => {
        const client = users.find(u => u._id === newUser._id)
        if (client) socket.to(`${client.socketId}`).emit('userUpdateToClient', newUser)
    })
    socket.on('activityOnlineOffline', newUser => {
        const myFollowings = users.filter(user => {
            let followingUser = newUser.followings.find(item => item._id === user._id)
            if (followingUser?.showActivity) { return true }
            else return false
        })
        const myFollowers = users.filter(user => {
            let followerUser = newUser.followers.find(item => item._id == user._id)
            if (followerUser?.showActivity) return true
            else return false
        })
        if (newUser.showActivity) {
            socket.emit('activityOnlineOfflineToMe', myFollowings.map((u) => (u._id)))
            myFollowers.forEach(follower => socket.to(`${follower.socketId}`).emit('activityOnlineOfflineToClients', newUser._id))
        }
        else {
            socket.emit('removeActivityOnlineOfflineToMe')
            myFollowers.forEach(follower => socket.to(`${follower.socketId}`).emit('removeActivityOnlineOfflineToClients', newUser._id))
        }
    })
    socket.on('showActivity', () => {
        const myClient = users.find(user => user.socketId === socket.id)
        if (!myClient?.showActivity) {
            const newClient = { ...myClient, showActivity: true }
            users = [...users.filter(user => user._id !== newClient._id), newClient]
            socket.emit('activityOnlineOffline', newClient)
        }
    })
    socket.on('hideActivity', () => {
        const myClient = users.find(user => user.socketId === socket.id)
        if (myClient?.showActivity) {
            const newClient = { ...myClient, showActivity: false }
            users = [...users.filter(user => user._id !== newClient._id), newClient]
            const otherClients = users.filter(user => newClient.followers.find(item => item._id === user._id))
            if (otherClients.length > 0) {
                otherClients.forEach(otherClient => {
                    socket.to(`${otherClient.socketId}`).emit('activityOnlineOffline', newClient._id)
                })
            }
        }
    })

    socket.on('createNotify', newNotify => {
        const clients = users.filter(u => newNotify.recipients.includes(u._id))
        clients.forEach(client => socket.to(`${client.socketId}`).emit('createNotifyToClient', newNotify)
        )
    })
    socket.on('removeNotify', removeNotify => {
        const clients = users.filter(u => removeNotify.recipients.includes(u._id))
        clients.forEach(client => socket.to(`${client.socketId}`).emit('removeNotifyToClient', removeNotify))
    })
    socket.on('messageUpdate', ({message, conversation}) => {
        const clients = users.filter(user => message.recipients.includes(user._id))
        clients.forEach(client => socket.to(`${client.socketId}`).emit('messageUpdateToClient', {message, conversation}))
    })
    socket.on('messageDeleteUpdate', ({message, conversation, userId}) => {
        const clients = users.filter(user => message.recipients.includes(user._id))
        clients.forEach(client => socket.to(`${client.socketId}`).emit('messageDeleteUpdateToClient', {messageId:message._id, conversation, userId}))
    })
    socket.on('messageRenewUpdate', (message) => {
        const clients = users.filter(user => message.recipients.includes(user._id))
        clients.forEach(client => socket.to(`${client.socketId}`).emit('messageRenewUpdateToClient', message))
    })

    socket.on('markMessagesAsSeen', async ({conversation, seenBy}) => {
        try {
            let members = conversation.members.map(m=>m._id)
            const clients = users.filter(user => members.includes(user._id))
            clients.forEach(client => socket.to(`${client.socketId}`).emit('markMessagesAsSeenToClient',{conversation, seenBy}))
            
            await Messages.updateMany({
                   conversation:conversation._id,
                $nin:{
                    seenBy
                }
            }, {$push:{seenBy}}, {new:true})
            await Conversations.findOneAndUpdate({
                _id:conversation._id,
            }, { [`unseenMessagesCount.${seenBy}`] :0 }, {new:true})

        } catch (error) {
        }
    })
    socket.on('conversationTypingEnable', async ({conversation, userId}) => {
        try {
            let members = conversation.members.map(m=>m._id)
            const clients = users.filter(user => members.includes(user._id))
            clients.forEach(client => socket.to(`${client.socketId}`).emit('conversationTypingEnableToClient',{conversation, userId}))
        } catch (error) {
        }
    })
    socket.on('conversationTypingDisable', async ({conversation, userId}) => {
        try {
            let members = conversation.members.map(m=>m._id)
            const clients = users.filter(user => members.includes(user._id))
            clients.forEach(client => socket.to(`${client.socketId}`).emit('conversationTypingDisableToClient',{conversation, userId}))
        } catch (error) {
        }
    })

   






























    // Call User
    // socket.on('callUser', data => {
    //     users = editData(users, data.sender, data.recipient)

    //     const client = users.find(user => user._id === data.recipient)

    //     if(client){
    //         if(client.call){
    //             socket.emit('userBusy', data)
    //             users = editData(users, data.sender, null)
    //         }else{
    //             users = editData(users, data.recipient, data.sender)
    //             socket.to(`${client.socketId}`).emit('callUserToClient', data)
    //         }
    //     }
    // })

    // socket.on('endCall', data => {
    //     const client = users.find(user => user._id === data.sender)

    //     if(client){
    //         socket.to(`${client.socketId}`).emit('endCallToClient', data)
    //         users = editData(users, client._id, null)

    //         if(client.call){
    //             const clientCall = users.find(user => user._id === client.call)
    //             clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)

    //             users = editData(users, client.call, null)
    //         }
    //     }
    // })
}

module.exports = SocketServer
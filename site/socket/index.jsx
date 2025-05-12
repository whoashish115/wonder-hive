import React, { useEffect, useRef } from 'react'
import useStore from '@/hooks/useStore'
import POST_TYPES from '@/store/types/postGlimpseTypes'
import GLOBAL_TYPES from '@/store/types/globalTypes'
import MESSAGES_TYPES from '@/store/types/messageTypes'
import NOTIFY_TYPES from '@/store/types/notifyTypes'
import STORY_TYPES from '@/store/types/storyTypes'
import { useRouter } from 'next/router'
import { getData } from '@/utils/fetchData'
import CONVERSATION_TYPES from '@/store/types/conversationTypes'
import PROFILE_TYPES from '@/store/types/profileTypes'


const spawnNotification = (body, icon, url, title) => {
    let options = {
        body, icon
    }
    let n = new Notification(title, options)

    n.onclick = e => {
        e.preventDefault()
        window.open(url, '_blank')
    }
}

const Socket = () => {
    const router = useRouter()
    const { state, dispatch } = useStore()
    const { auth, socket, settings, activity } = state
    const audioRef = useRef()

    useEffect(() => {
        socket.emit('joinUser', auth.user)
    }, [socket, auth.user])

    useEffect(() => {
        socket.on('postGlimpseUpdateToClient', newPostGlimpse => { dispatch({ type: POST_TYPES.POST_UPDATE, payload: newPostGlimpse }) })
        return () => socket.off('postGlimpseUpdateToClient')
    }, [socket, dispatch])

    useEffect(() => {
        socket.on('storyUpdateToClient', newStory => { dispatch({ type: STORY_TYPES.STORY_UPDATE, payload: newStory }) })
        return () => socket.off('storyUpdateToClient')
    }, [socket, dispatch])

    useEffect(() => {
        socket.on('userUpdateToClient', newUser => { dispatch({ type: GLOBAL_TYPES.AUTH, payload: { ...auth, user: newUser } }) })
        return () => socket.off('userUpdateToClient')
    }, [socket, dispatch, auth])

    useEffect(() => {
        socket.on('authUserUpdateToClient', newAuthUser => { dispatch({ type: PROFILE_TYPES.PROFILE_UPDATE, payload: newAuthUser });dispatch({ type: GLOBAL_TYPES.AUTH, payload: {...auth, user:{...auth.user, followings:[...auth.user.followings.filter(u=>u._id !== newAuthUser._id), newAuthUser]}} }) })
        return () => socket.off('authUserUpdateToClient')
    }, [socket, dispatch, auth])

    useEffect(() => {
        socket.on('createNotifyToClient', message => {
            dispatch({ type: NOTIFY_TYPES.NOTIFY_CREATE, payload: message })
            if (settings.notifySound) {
                audioRef.current.play()
                spawnNotification("@" + message.user.username + ' ' + message.text, message.user.profileImage, message.url, 'Dook')
            }
        })
        return () => socket.off('createNotifyToClient')
    }, [socket, dispatch, settings])

    useEffect(() => {
        socket.on('removeNotifyToClient', message => { dispatch({ type: NOTIFY_TYPES.NOTIFY_DELETE, payload: message }) })
        return () => socket.off('removeNotifyToClient')
    }, [socket, dispatch])

    useEffect(() => {
        socket.emit('activityOnlineOffline', auth.user)
    }, [socket, auth.user])
    useEffect(() => {
        socket.on('activityOnlineOfflineToMe', myFollowingsOnline => {
            dispatch({ type: GLOBAL_TYPES.ACTIVITY, payload: [...activity.filter(a => myFollowingsOnline.includes(a)), ...myFollowingsOnline] })
        })
        return () => socket.off('activityOnlineOfflineToMe')
    }, [socket, dispatch, activity])
    useEffect(() => {
        socket.on('removeActivityOnlineOfflineToMe', () => dispatch({ type: GLOBAL_TYPES.ACTIVITY, payload: [] }))
        return () => socket.off('removeActivityOnlineOfflineToMe')
    }, [socket, dispatch, activity])
    useEffect(() => {
        socket.on('activityOnlineOfflineToClients', myFollowerOnlineId => {
            if (!activity.includes(myFollowerOnlineId)) {
                dispatch({ type: GLOBAL_TYPES.ACTIVITY, payload: [...activity.filter(a => myFollowingsOnline.includes(a)), myFollowerOnlineId] })
            }
        })
        return () => socket.off('activityOnlineOfflineToClients')
    }, [socket, dispatch, activity])
    useEffect(() => {
        socket.on('removeActivityOnlineOfflineToClients', myFollowerOfflineId => {
            if (activity.includes(myFollowerOfflineId)) dispatch({ type: GLOBAL_TYPES.ACTIVITY, payload: activity.filter(id => id == myFollowerOfflineId) })
        })
        return () => socket.off('removeActivityOnlineOfflineToClients')
    }, [socket, dispatch, activity])

    useEffect(() => {
        socket.on('activityOnlineOffline', userId => dispatch({ type: GLOBAL_TYPES.ACTIVITY, payload: activity.filter(id => id == userId) }))
        return () => socket.off('activityOnlineOffline')
    }, [socket, dispatch])

    useEffect(() => {
        socket.on('messageUpdateToClient', async ({ message, conversation }) => {
            let currentConversationId = router.pathname == '/message/[id]' ? router.query.id : ''
            if (currentConversationId == message.conversation) { getData(`message/conversation/readall/${currentConversationId}`, auth.token) }
            dispatch({ type: MESSAGES_TYPES.MESSAGE_CREATE, payload: { message, conversation } })
        })
        return () => socket.off('messageUpdateToClient')
    }, [socket, dispatch])
    useEffect(() => {
        socket.on('messageDeleteUpdateToClient', async ({ messageId, conversation, userId }) => {
            dispatch({ type: MESSAGES_TYPES.MESSAGE_DELETE, payload: { messageId, conversation, userId } })
        })
        return () => socket.off('messageDeleteUpdateToClient')
    }, [socket, dispatch])
    useEffect(() => {
        socket.on('messageRenewUpdateToClient', async (message) => {
            dispatch({ type: MESSAGES_TYPES.MESSAGE_UPDATE, payload: message })
        })
        return () => socket.off('messageRenewUpdateToClient')
    }, [socket, dispatch])
    useEffect(() => {
        socket.on('markMessagesAsSeenToClient', ({ conversation, seenBy }) => {
            dispatch({ type: MESSAGES_TYPES.MESSAGE_SEEN_ALL, payload: { conversation, seenBy } })
        })
        return () => socket.off('markMessagesAsSeenToClient')
    }, [socket, dispatch])
    useEffect(() => {
        socket.on('conversationTypingDisableToClient', ({ conversation, userId }) => {
            dispatch({ type: CONVERSATION_TYPES.CONVERSATION_TYPING_DISABLE, payload: { conversation, userId } })
        })
        return () => socket.off('conversationTypingDisableToClient')
    }, [socket, dispatch])
    useEffect(() => {
        socket.on('conversationTypingEnableToClient', ({ conversation, userId }) => {
            dispatch({ type: CONVERSATION_TYPES.CONVERSATION_TYPING_ENABLE, payload: { conversation, userId } })
        })
        return () => socket.off('conversationTypingEnableToClient')
    }, [socket, dispatch])


    // Call User
    // useEffect(() => {
    //     socket.on('callUserToClient', data => {
    //         dispatch({ type: GLOBAL_TYPES.CALL, payload: data })
    //     })

    //     return () => socket.off('callUserToClient')
    // }, [socket, dispatch])

    // useEffect(() => {
    //     socket.on('userBusy', data => {
    //         dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: `${call.username} is busy!` } })
    //     })

    //     return () => socket.off('userBusy')
    // }, [socket, dispatch, call])



    return (
        <>
            <audio controls ref={audioRef} style={{ display: "none" }}>
                <source src={'/audio/sound.wav'} type="audio/mp3" />
            </audio>
        </>
    )
}

export default Socket

import { deleteData, getData, postData } from "@/utils/fetchData"
import GLOBAL_TYPES from "../types/globalTypes"
import CONVERSATION_TYPES from "../types/conversationTypes"
import { filesUpload } from "@/utils/filesUpload"
import MESSAGE_TYPES from "../types/messageTypes"

export const getConversations = async (dispatch, { auth, page = 1 }) => {
    const res = await getData(`conversations/get?limit=${page * 9}`, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    let newConversations = res.conversations.reduce((acc, conver) => {
        if (conver.isGroup) {
            acc[conver._id] = {...conver, firstLoad:false};
        }
        else {
            let user = conver.members.length == 1 ? conver.members[0] : conver.members.filter(m => m._id !== auth.user._id)[0]
            acc[user.username] = { ...conver, user,  firstLoad:false }
        }
        return acc;
    }, {})
    dispatch({ type: CONVERSATION_TYPES.CONVERSATION_GET_ALL, payload: { result: newConversations.length, conversations: newConversations } })
}

export const deleteConversation = async (dispatch, { auth, conversation, refId }) => {
    dispatch({ type: CONVERSATION_TYPES.CONVERSATION_DELETE, payload: {refId, userId:auth.user._id , conversationId:conversation._id}})
    const res = await deleteData(`conversation/${conversation._id}`, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
}

export const createConversation = async (dispatch, { auth, members }) => {
    const res = await postData(`conversation/create`, { members: members.map((m) => m._id), isGroup: false }, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    dispatch({ type: CONVERSATION_TYPES.CONVERSATION_CREATE, payload: { ...res.conversation, creator: auth.user, members, user: members.length == 1 ? members[0] :members.filter(m => m._id !== auth.user._id)[0], admins: members } });
}

export const createGroup = async (dispatch, { auth, members, isGroup = true, groupTitle, groupPicture, socket }) => {
    let picture;
    if (groupPicture) picture = await filesUpload([groupPicture])
        const res = await postData(`conversation/create`, { members: members.map((m) => m._id), isGroup, picture: groupPicture ? picture[0].url : '', title: groupTitle, bio:groupBio }, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
        const newConver = { ...res.conversation, creator: auth.user, admins: auth.user, members }
            dispatch({ type: MESSAGE_TYPES.MESSAGE_CREATE, payload: { message: res.newMessage, conversation: newConver } })
            socket.emit('messageUpdate', { message: res.newMessage, conversation: newConver })
            return res.conversation._id
}
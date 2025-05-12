import { deleteData, getData, postData } from "@/utils/fetchData"
import GLOBAL_TYPES from "../types/globalTypes"
import { dataTools } from "@/utils/tools"
import MESSAGE_TYPES from "../types/messageTypes"


export const addMessage = async (dispatch, { message, conversation, auth, socket }) => {
    const res = await postData('message/create', message, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
        dispatch({ type: MESSAGE_TYPES.MESSAGE_CREATE, payload: { message: res.newMessage, conversation } })
        socket.emit('messageUpdate', { message: res.newMessage,conversation: conversation.isGroup ? conversation :{...conversation, user:auth.user}, })
}

export const seenMessages = async (dispatch, { auth, conversation, socket }) => {
    dispatch({ type: MESSAGE_TYPES.MESSAGE_SEEN_ALL, payload: { conversation, seenBy: auth.user._id } })
    socket.emit('markMessagesAsSeen', { conversation: conversation.isGroup ? conversation :{...conversation, user:auth.user}, seenBy: auth.user._id })
}

export const getMessages = async (dispatch, { auth, id, refId, page=1 }) => {
    const res = await getData(`message/conversation/${id}?limit=${page * 9}`, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    dispatch({ type: MESSAGE_TYPES.MESSAGE_GET_ALL, payload: {messages:res.messages, refId, result:res.result, page} })
    return res.result
}

export const deleteMessage = async (dispatch, { message,conversation, auth , socket}) => {
    dispatch({ type: MESSAGE_TYPES.MESSAGE_DELETE, payload: {messageId:message._id, conversation, userId:auth.user._id} })
    const res = await deleteData(`message/delete/${conversation._id}/${message._id}`, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
        socket.emit('messageDeleteUpdate', { conversation:{...conversation, user:auth.user}, message, userId:auth.user._id })

}
export const editMessage = async (dispatch, { message,conversation, auth, socket }) => {
    dispatch({ type: MESSAGE_TYPES.MESSAGE_DELETE, payload: {messageId:message._id, conversationId:conversation._id, userId:auth.user._id} })
    const res = await deleteData(`message/delete/${conversation._id}/${message._id}`, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
        socket.emit('messageRenewUpdate', { conversation, message, userId:auth.user._id })

}


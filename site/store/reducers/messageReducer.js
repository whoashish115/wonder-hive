import { dataTools } from '@/utils/tools';
import MESSAGE_TYPES from '../types/messageTypes';
import { addRequestMeta } from 'next/dist/server/request-meta';

const messageReducer = (state, action) => {
    switch (action.type) {
        case MESSAGE_TYPES.MESSAGE_CREATE:
            let currentConver = action.payload.conversation
            return {
                ...state,
                message: {
                    [action.payload.message._id]:action.payload.message,
                    ...state.message,
                },
                conversation: {
                    ...state.conversation,
                    data: {
                        ...state.conversation.data,
                        [currentConver.isGroup ? currentConver._id: currentConver.user.username]:
                        {
                            ...currentConver,
                            endMessage: action.payload.message.text ? action.payload.message.text : (action.payload.message.medias.length === 0 ? 'media' : (action.payload.message.call ? 'call' : '')),
                            endMessageDate: new Date(),
                            messagesCount:{
                                ...currentConver.messagesCount,
                                ...[...action.payload.message.recipients, action.payload.message.sender].reduce((acc, rec) => {
                                    acc[rec] = currentConver.messagesCount[rec] + 1;
                                    return acc
                                }, {}),
                            }, 
                            unseenMessagesCount: {
                                ...currentConver.unseenMessagesCount,  ...action.payload.message.recipients.reduce((acc, rec) => {
                                    rec
                                    if (currentConver.unseenMessagesCount && currentConver.unseenMessagesCount[rec]) {
                                        acc[rec] = currentConver.unseenMessagesCount[rec] + 1;
                                    }
                                    else {
                                        acc[rec] = 1;
                                    }
                                    return acc;
                                }, {}),
                                [action.payload.message.sender]: 0,
                            }
                        }
                    }
                }
                }
        case MESSAGE_TYPES.MESSAGE_SEEN_ALL:
            let tobeSeenedConver = action.payload.conversation
            return {
                ...state,
                message: 
                {
                    ...state.message,
                    ...Object.values(state.message).map((msg) => {
                    if (msg.conversation == tobeSeenedConver._id) {
                        return { ...msg, seenBy: [...msg.seenBy, action.payload.seenBy] }
                    }
                    else return msg
                }).reduce((acc, item) => {
                    acc[item._id] = item;
                    return acc;
                }, {})
            },
                conversation: {
                    ...state.conversation,
                    data:{
                        ...state.conversation.data,
                        [tobeSeenedConver.isGroup ? tobeSeenedConver._id: tobeSeenedConver.user.username]:{
                            ...tobeSeenedConver,
                            unseenMessagesCount: { ...tobeSeenedConver?.unseenMessagesCount, [action.payload.seenBy]: 0 }
                        }
                    }
                }
            };
        case MESSAGE_TYPES.MESSAGE_GET_ALL:
            return {
                ...state,
                message: {...state.message,
                ...action.payload.messages.reduce((acc, msg) => {
                    acc[msg._id] = msg;
                    return acc;
                }, {})},
                conversation:{
                    ...state.conversation,
                    data:{
                        ...state.conversation.data,
                        [action.payload.refId]:{
...state.conversation.data[action.payload.refId],
firstLoad:true,
page:action.payload.page,
result:action.payload.result,

                        }

                    }
                }
            };
        case MESSAGE_TYPES.MESSAGE_UPDATE:
            return {
                ...state,
                message: {
                    ...state.message,
                    [action.payload._id]: action.payload
                }
            };
        case MESSAGE_TYPES.MESSAGE_DELETE:
            let {[action.payload.messageId]:deletedMessage, ...restMessage} = state.message
            let {[action.payload.conversation.isGroup ? action.payload.conversation._id : action.payload.conversation.user.username]:toBeUpdatedConversation, ...resConver} = state.conversation.data
            return {
                ...state,
                message: restMessage,
                conversation:{
                    ...state.conversation,
                    data:{
                        ...resConver,
                        [action.payload.conversation.isGroup ? action.payload.conversation._id : action.payload.conversation.user.username]:{
                            ...toBeUpdatedConversation,
                            messagesCount:{
                                ...toBeUpdatedConversation.messagesCount,
                                userId:toBeUpdatedConversation.messagesCount[action.payload.userId]-1
                            },
                            endMessage:(((deletedMessage.text ? deletedMessage.text : (deletedMessage.medias.length === 0 ? 'media' : (deletedMessage.call ? 'call' : ''))) == toBeUpdatedConversation.endMessage) && deletedMessage.conversation == toBeUpdatedConversation._id) ? '' :toBeUpdatedConversation.endMessage,
                            endDate:new Date(),
                        }
                    }
                }
            };
        default:
            return state;
    }
}

export default messageReducer
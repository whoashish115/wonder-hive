import { dataTools } from '@/utils/tools';
import CONVERSATION_TYPES from '../types/conversationTypes';

const conversationReducer = (state, action) => {
    switch (action.type) {
        case CONVERSATION_TYPES.CONVERSATION_CREATE:
            if(action.payload.isGroup){
                return {
                    ...state,
                    conversation: {
                        ...state.conversation,
                        data: {
                            ...state.conversation.data,
                             [action.payload._id] :action.payload, 
                        }
                    }
                };
            }
            else {
                return{
                    ...state,
                    conversation: {
                        ...state.conversation,
                        data: {
                            ...state.conversation.data,
                             [action.payload.user.username] :action.payload, 
                        }
                    }

                }
            };
        case CONVERSATION_TYPES.CONVERSATION_DELETE:
            const {[action.payload.refId]:deletedConversation, ...rest} = state.conversation.data
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    data:{...rest, [action.payload.refId]:{...deletedConversation, removedFrom:[action.payload.userId]}},

                }, 
                message:{
                    ...Object.values(state.message).filter(m=>m.conversation !== action.payload.conversationId).reduce((acc, item) => {
                        acc[item._id] = item;
                        return acc;
                    }, {})
                }
            };
        case CONVERSATION_TYPES.CONVERSATION_GET_ALL:
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    data: action.payload.conversations,
                    firstLoad: true
                }
            };
        case CONVERSATION_TYPES.CONVERSATION_TYPING_ENABLE:
            const refId2 = action.payload.conversation.isGroup ? action.payload.conversation._id: action.payload.conversation.user.username
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    data: {
                        ...state.conversation.data, 
                        [refId2]:{
                            ...state.conversation.data[refId2], 
                            typing:state.conversation.data[refId2].typing ? [...state.conversation.data[refId2].typing,action.payload.userId]:[action.payload.userId]
                        }
                    }
                }
            };
        case CONVERSATION_TYPES.CONVERSATION_TYPING_DISABLE:
            const refId1 = action.payload.conversation.isGroup ? action.payload.conversation._id: action.payload.conversation.user.username
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    data: {
                        ...state.conversation.data, 
                        [refId1]:{
                            ...state.conversation.data[refId1], 
                            typing:state.conversation.data[refId1].typing?.filter(userId=> userId!== action.payload.userId)
                        }
                    }
                }
            };

        default:
            return state;
    }
}

export default conversationReducer
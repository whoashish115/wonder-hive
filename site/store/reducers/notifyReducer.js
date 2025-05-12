import { dataTools } from '@/utils/tools';
import notifyInitialState from '../initialState/notifyInitialState';
import NOTIFY_TYPES from '../types/notifyTypes';

const notifyReducer = (state = notifyInitialState, action) => {
    switch (action.type) {
        case NOTIFY_TYPES.NOTIFY_GET:
            return {
                ...state,
                notify: {
                    ...state.notify,
                        data: action.payload
                }
            };
        case NOTIFY_TYPES.NOTIFY_CREATE:
            return {
                ...state,
                notify: {
                    ...state.notify,
                    data: [action.payload, ...state.notify.data]
                }
            };
        case NOTIFY_TYPES.NOTIFY_READ_ALL:
            return {
                ...state,
                notify: {
                    ...state.notify,
                    data: [...state.notify.data.map((notify)=> {return {...notify, readBy:[...notify.readBy, state.auth.user._id]}})]
                }
                
            };
        case NOTIFY_TYPES.NOTIFY_DELETE:
            return {
                ...state,
                notify: {
                    ...state.notify,
                    data: state.notify.data.filter(item => (
                        item.id !== action.payload.id || item.url !== action.payload.url
                    ))
                }
             
            };
        case NOTIFY_TYPES.NOTIFY_DELETE_ALL:
            return {
                ...state,
                notify: {
                    ...state.notify,
                    data: action.payload
                }
                
            };
        default:
            return state;
    }
}

export default notifyReducer
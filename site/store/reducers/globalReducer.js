import GLOBAL_TYPES from '../types/globalTypes'
import rootState from "../initialState/index"

const globalReducer = (state, action) => {
    switch (action.type) {
        case GLOBAL_TYPES.RESET:
            return { ...rootState, theme: state.theme, settings: state.settings, accounts:state.accounts, alert:state.alert };
        case GLOBAL_TYPES.THEME_MODE:
            return {
                ...state,
                theme: {
                    ...state.theme,
                    mode: action.payload
                }
            };
        case GLOBAL_TYPES.THEME_COLOR:
            return {
                ...state,
                theme: {
                    ...state.theme,
                    color: action.payload
                }
            };
        case GLOBAL_TYPES.THEME_FONT_TYPE:
            return {
                ...state,
                theme: {
                    ...state.theme,
                    font: {
                        ...state.theme.font,
                        type: action.payload
                    }
                }
            };
        case GLOBAL_TYPES.SETTINGS_NOTIFY_SOUND:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    notifySound: action.payload
                }
            };
        case GLOBAL_TYPES.SETTINGS_MESSAGE_SOUND:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    messageSound: action.payload
                }
            };
        case GLOBAL_TYPES.SETTINGS_GLIMPSE_SOUND:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    glimpseSound: action.payload
                }
            };
        case GLOBAL_TYPES.THEME_FONT_SIZE:
            return {
                ...state,
                theme: {
                    ...state.theme,
                    font: {
                        ...state.theme.font,
                        size: action.payload
                    }
                }
            };
        case GLOBAL_TYPES.THEME_BORDER_RADIUS:
            return {
                ...state,
                theme: {
                    ...state.theme,
                    borderradius: action.payload
                }
            };
        case GLOBAL_TYPES.LOADING:
            return {
                ...state,
                alert: { loading: action.payload }
            };
        case GLOBAL_TYPES.ALERT_ERROR:
            return {
                ...state,
                alert: { error: action.payload }
            };
        case GLOBAL_TYPES.ALERT_INFO:
            return {
                ...state,
                alert: { info: action.payload }
            };
        case GLOBAL_TYPES.ALERT_WARNING:
            return {
                ...state,
                alert: { warning: action.payload }
            };
        case GLOBAL_TYPES.ALERT_SUCCESS:
            return {
                ...state,
                alert: { success: action.payload }
            };
        case GLOBAL_TYPES.AUTH:
            return {
                ...state,
                auth: action.payload
            };
        case GLOBAL_TYPES.SOCKET:
            return {
                ...state,
                socket: action.payload
            };
        case GLOBAL_TYPES.ACTIVITY:
            return {
                ...state,
                activity: action.payload
            };
        case GLOBAL_TYPES.ACCOUNTS:
            return {
                ...state,
                accounts: action.payload
            };
        case GLOBAL_TYPES.STORY:
            return {
                ...state,
                currentStory: action.payload
            };
        case GLOBAL_TYPES.SUGGESTIONS_GET:
            return {
                ...state,
                suggestions:{
                    ...state.suggestions,
                    firstLoad:true,
                    users:action.payload.users
                }
            };
        case GLOBAL_TYPES.SUGGESTIONS_LOADING:
            return {
                ...state,
                suggestions:{
                    ...state.suggestions,
                    loading:action.payload
                }
            };
        default:
            return state;
    }
}

export default globalReducer
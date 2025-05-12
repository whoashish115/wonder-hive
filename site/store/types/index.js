import GLOBAL_TYPES from "./globalTypes"
import MESSAGES_TYPES from "./messageTypes"
import NOTIFY_TYPES from "./notifyTypes"
import POST_GLIMPSE_TYPES from "./postGlimpseTypes"
import PROFILE_TYPES from "./profileTypes"

const ROOT_TYPES = {
    ...GLOBAL_TYPES,
    ...PROFILE_TYPES,
    ...POST_GLIMPSE_TYPES,
    ...NOTIFY_TYPES,
    ...MESSAGES_TYPES
}
export default ROOT_TYPES
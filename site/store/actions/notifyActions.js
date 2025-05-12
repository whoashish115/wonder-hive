import { deleteData, postData, getData, patchData } from '../../utils/fetchData'
import NOTIFY_TYPES from '../types/notifyTypes'
import GLOBAL_TYPES from '../types/globalTypes'

export const createNotify = async (dispatch, { message, auth, socket }) => {
    const res = await postData('notify/create', message, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    socket.emit('createNotify', {
        ...res.notify,
        user: {
            fullname: auth.user.fullname,
            username: auth.user.username,
            profileImage: auth.user.profileImage
        }
    })
}

export const removeNotify = async (dispatch, { message, auth, socket }) => {
    const res = await deleteData(`notify/id/${message.id}?url=${message.url}`, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    socket.emit('removeNotify', message)
}

export const getNotifies = async (dispatch, token) => {
    const res = await getData('notify/all', token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    dispatch({ type: NOTIFY_TYPES.NOTIFY_GET, payload: res.notifies })
}


export const readAllNotify = async (dispatch, { auth }) => {
    dispatch({ type: NOTIFY_TYPES.NOTIFY_READ_ALL })
    const res = await patchData(`notify/read-all`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

}
export const deleteAllNotifies = async (dispatch, token) => {
    dispatch({ type: NOTIFY_TYPES.NOTIFY_DELETE_ALL, payload: [] })
    const res = await deleteData('/notify/all', token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
}
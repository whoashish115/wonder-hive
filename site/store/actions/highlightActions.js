import { filesUpload } from "@/utils/filesUpload"
import GLOBAL_TYPES from "../types/globalTypes"
import HIGHLIGHT_TYPES from "../types/highlightTypes"
import { deleteData, postData } from "@/utils/fetchData"

export const createHighlight = async (dispatch, { title, picture, stories, auth }) => {
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: true })
    const newPicture = await filesUpload([picture.file])
    const res = await postData('highlight/create', {title,  picture: { ...newPicture[0], width: picture.width, height: picture.height } ,stories}, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    dispatch({
        type: HIGHLIGHT_TYPES.HIGHLIGHT_CREATE,
        payload: { ...res.newHighlight, user: auth.user }
    })

    dispatch({ type: GLOBAL_TYPES.LOADING, payload: false })
}
export const deleteHighlight = async (dispatch, { highlight, auth }) => {
    dispatch({ type: HIGHLIGHT_TYPES.HIGHLIGHT_DELETE, payload: highlight })
    const res = await deleteData(`highlight/delete/${highlight._id}`, auth.token)
    if (res.error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

}

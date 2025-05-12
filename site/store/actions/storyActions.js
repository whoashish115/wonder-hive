import { filesUpload } from "@/utils/filesUpload";
import GLOBAL_TYPES from "../types/globalTypes";
import STORY_TYPES from "../types/storyTypes";
import { deleteData, getData, patchData, postData } from "@/utils/fetchData";
import { createNotify, removeNotify } from "./notifyActions";


export const createStory = async (dispatch, { media, auth }) => {
        dispatch({ type: GLOBAL_TYPES.LOADING, payload: true })
        const newMedia = await filesUpload([media.file])
        const res = await postData('story/create', { media: { ...newMedia[0], width: media.width, height: media.height } }, auth.token)
        if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
        dispatch({
            type: STORY_TYPES.STORY_CREATE,
            payload: { ...res.newStory, user: auth.user }
        })

        dispatch({ type: GLOBAL_TYPES.LOADING, payload: false })
}
export const viewStory = async (dispatch, { story, auth }) => {
    const newStory = { ...story, views: [...story.views, auth.user] }
    dispatch({ type: STORY_TYPES.STORY_UPDATE, payload: newStory })
    const res = await patchData(`story/${story._id}/view`, null, auth.token)
    if (res.error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
}
export const heartStory = async (dispatch, { story, auth, socket }) => {
    const newStory = { ...story, hearts: [...story.hearts, auth.user] }

    dispatch({ type: STORY_TYPES.STORY_UPDATE, payload: newStory })
    socket.emit('storyUpdate', newStory)

    const res = await patchData(`story/${story._id}/heart`, null, auth.token)
    if (res.error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    const message = { id: auth.user._id, text: 'like your story.', recipients: [story.user._id], url: ``, content: story.content, media: story.media }
    createNotify(dispatch,{ message, auth, socket })
}

export const removeHeartStory = async (dispatch, { story, auth, socket }) => {
    const newStory = { ...story, hearts: story.hearts.filter(heart => heart._id !== auth.user._id) }

    dispatch({ type: STORY_TYPES.STORY_UPDATE, payload: newStory })
    socket.emit('storyUpdate', newStory)

    const res = await patchData(`story/${story._id}/removeheart`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    const message = { id: auth.user._id, text: 'like your story.', recipients: [story.user._id], url: ``, }
    removeNotify(dispatch,{ message, auth, socket })
}
export const deleteStory = async (dispatch, { story, auth }) => {
    dispatch({ type: STORY_TYPES.STORY_DELETE, payload: story })
    const res = await deleteData(`story/delete/${story._id}`, auth.token)
    if (res.error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

}


export const getStories = async (dispatch, token) => {
    dispatch({ type: STORY_TYPES.HOME_STORY_LOADING, payload: true })
    const res = await getData('stories', token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    dispatch({ type: STORY_TYPES.HOME_STORY_GET, payload: { ...res, page: 2 } })
    dispatch({ type: STORY_TYPES.HOME_STORY_LOADING, payload: false })
}

export const getArchiveStories = async (dispatch, auth) => {
    dispatch({ type: STORY_TYPES.ARCHIVE_STORY_LOADING, payload: true })

    const res = await getData('story/archive', auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    dispatch({ type: STORY_TYPES.ARCHIVE_STORY_GET, payload: { ...res, page: 2 } })
    dispatch({ type: STORY_TYPES.ARCHIVE_STORY_LOADING, payload: false })
}
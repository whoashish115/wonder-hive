import { deleteData, getData, patchData, postData } from '../../utils/fetchData'
import { filesUpload } from "@/utils/filesUpload";
import POST_GLIMPSE_TYPES from '../types/postGlimpseTypes';
import GLOBAL_TYPES from '../types/globalTypes';
import { createNotify, removeNotify } from './notifyActions';

export const createPostGlimpse = async (dispatch, { content, medias, auth, socket }) => {
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: true })

    if (medias.length < 0) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: 'Atleast one media file is required' })

    let allMedias = []
    let newMedia;
    for (let i = 0; i < medias.length; i++) {
        newMedia = await filesUpload([medias[i].file])
        if (newMedia[0].url) {
            allMedias.push({ ...newMedia[0], width: medias[i].width, height: medias[i].height })
        }
    }

    const res = await postData('post-glimpse/create', { content, medias: allMedias }, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_CREATE, payload: { ...res.newPostGlimpse, user: auth.user } })

    const message = { id: res.newPostGlimpse._id, text: res.newPostGlimpse.glimpse ? 'added a new glimpse.' : 'added a new post.', recipients: res.newPostGlimpse.user.followers, url: `/${res.newPostGlimpse.glimpse ? 'glimpse' : 'post'}/${res.newPostGlimpse._id}`, content, media: medias[0] }
    createNotify(dispatch, { message, auth, socket })

    dispatch({ type: GLOBAL_TYPES.LOADING, payload: false })

}

export const updatePostGlimpse = async (dispatch, { content, medias, auth, status }) => {
    if (medias.length < 0) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: 'Atleast one media file is required' })

    dispatch({ type: GLOBAL_TYPES.LOADING, payload: true })

    let initialMedias = medias.filter(media => media.url)
    let finalMedias = medias.filter(media => media.url)
    let allMedias = [...initialMedias]
    let newMedia;
    for (let i = 0; i < finalMedias.length; i++) {
        newMedia = await filesUpload([finalMedias[i].file])
        if (newMedia[0].url) {
            allMedias.push({ ...newMedia[0], width: finalMedias[i].width, height: finalMedias[i].height })
        }
    }

    const res = await patchData(`post-glimpse/update/${status._id}`, { content, medias: allMedias }, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE, payload: res.newPostGlimpse })

    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { success: res.message } })
}

export const deletePostGlimpse = async (dispatch, { postGlimpse, auth }) => {
    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_DELETE, payload: postGlimpse })
    const res = await deleteData(`post-glimpse/delete/${postGlimpse._id}`, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    const message = { id: res.deletedPostGlimpse._id, text: res.deletedPostGlimpse.glimpse ? 'added a new glimpse.' : 'added a new post.', recipients: res.deletedPostGlimpse.user.followers, url: `/${res.deletedPostGlimpse.glimpse ? 'glimpse' : 'post'}/${res.deletedPostGlimpse._id}`, content, media: res.deletedPostGlimpse.media }
    removeNotify(dispatch, { message, auth, socket })
}

export const likePostGlimpse = async (dispatch, { postGlimpse, auth, socket }) => {
    const newPostGlimpse = { ...postGlimpse, likes: [...postGlimpse.likes, auth.user] }
    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE, payload: newPostGlimpse })

    socket.emit('postGlimpseUpdate', newPostGlimpse)

    const res = await patchData(`post-glimpse/like/${postGlimpse._id}`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    const message = { id: auth.user._id, text: postGlimpse.glimpse ? 'like your glimpse.' : 'like your post.', recipients: [postGlimpse.user._id], url: `/post/${postGlimpse._id}`, content: postGlimpse.content, media: postGlimpse.medias[0] }
    createNotify(dispatch, { message, auth, socket })

}

export const removeLikePostGlimpse = async (dispatch, { postGlimpse, auth, socket }) => {
    const newPostGlimpse = { ...postGlimpse, likes: postGlimpse.likes.filter(like => like._id !== auth.user._id) }
    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE, payload: newPostGlimpse })
    socket.emit('postGlimpseUpdate', newPostGlimpse)
    const res = await patchData(`post-glimpse/removelike/${postGlimpse._id}`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    const message = { id: auth.user._id, text: postGlimpse.glimpse ? 'like your glimpse.' : 'like your post.', recipients: [postGlimpse.user._id], url: `/post/${postGlimpse._id}`, content: postGlimpse.content, media: postGlimpse.medias[0] }
    removeNotify(dispatch, { message, auth, socket })
}


export const savePostGlimpse = async (dispatch, { postGlimpse, auth, socket }) => {
    const newPostGlimpse = { ...postGlimpse, saves: [...postGlimpse.saves, auth.user._id] }
    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE, payload: newPostGlimpse })
    socket.emit('postGlimpseUpdate', newPostGlimpse)
    const res = await patchData(`post-glimpse/save/${postGlimpse._id}`, null, auth.token)

    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
}

export const removeSavePostGlimpse = async (dispatch, { postGlimpse, auth, socket }) => {
    const newPostGlimpse = { ...postGlimpse, saves: postGlimpse.saves.filter(save => save !== auth.user._id) }
    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE, payload: newPostGlimpse })
    socket.emit('postGlimpseUpdate', newPostGlimpse)
    const res = await patchData(`post-glimpse/removesave/${postGlimpse._id}`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
}

export const getExplorePosts = async (dispatch, token) => {
    dispatch({ type: POST_GLIMPSE_TYPES.EXPLORE_POST_LOADING, payload: true })

    const res = await getData(`post-glimpse/posts/random`, token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    dispatch({ type: POST_GLIMPSE_TYPES.EXPLORE_POST_GET, payload: { ...res, page: 2 } })

    dispatch({ type: POST_GLIMPSE_TYPES.EXPLORE_POST_LOADING, payload: false })
}
export const getExploreGlimpses = async (dispatch, token) => {
    dispatch({ type: POST_GLIMPSE_TYPES.EXPLORE_GLIMPSE_LOADING, payload: true })

    const res = await getData(`post-glimpse/glimpses/random`, token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    dispatch({ type: POST_GLIMPSE_TYPES.EXPLORE_GLIMPSE_GET, payload: { ...res, page: 2 } })

    dispatch({ type: POST_GLIMPSE_TYPES.EXPLORE_GLIMPSE_LOADING, payload: false })
}
export const getFeedPostsGlimpses = async (dispatch, token) => {
    dispatch({ type: POST_GLIMPSE_TYPES.FEED_POST_GLIMPSE_LOADING, payload: true })
    const res = await getData('post-glimpse/feed', token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    dispatch({ type: POST_GLIMPSE_TYPES.FEED_POST_GLIMPSE_GET, payload: { ...res, page: 2 } })
    dispatch({ type: POST_GLIMPSE_TYPES.FEED_POST_GLIMPSE_LOADING, payload: false })
}
export const getSavePostsGlimpses = async (dispatch, token) => {
    dispatch({ type: POST_GLIMPSE_TYPES.SAVE_POST_GLIMPSE_LOADING, payload: true })
    const res = await getData('post-glimpse/saves', token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    dispatch({ type: POST_GLIMPSE_TYPES.SAVE_POST_GLIMPSE_GET, payload: { ...res, page: 2 } })
    dispatch({ type: POST_GLIMPSE_TYPES.SAVE_POST_GLIMPSE_LOADING, payload: false })
}
export const getDetailedPostGlimpse = async (dispatch, { detailedPostsGlimpses, id, auth }) => {
    if (!detailedPostsGlimpses[id]) {
        const res = await getData(`post-glimpse/get/${id}`, auth.token)
        if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
        if (res.postGlimpse) {
            dispatch({ type: POST_GLIMPSE_TYPES.DETAILED_POST_GLIMPSE_GET, payload: res.postGlimpse })
        }
    }
}
export const getDetailedPost = async (dispatch, { detailedPostsGlimpses, id, auth }) => {
    if (!detailedPostsGlimpses[id]) {
        const res = await getData(`post-glimpse/post/${id}`, auth.token)
        if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
        if (res.post) {
            dispatch({ type: POST_GLIMPSE_TYPES.DETAILED_POST_GLIMPSE_GET, payload: res.post })
        }
    }
}
export const getDetailedGlimpse = async (dispatch, { detailedPostsGlimpses, id, auth }) => {
    if (!detailedPostsGlimpses[id]) {
        const res = await getData(`post-glimpse/glimpse/${id}`, auth.token)
        if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
        if (res.glimpse) {
            dispatch({ type: POST_GLIMPSE_TYPES.DETAILED_POST_GLIMPSE_GET, payload: res.glimpse })
        }
    }
}

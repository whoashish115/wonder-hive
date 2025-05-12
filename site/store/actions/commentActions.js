import { dataTools } from '@/utils/tools'
import { patchData, deleteData, postData } from '../../utils/fetchData'
import GLOBAL_TYPES from '../types/globalTypes'
import POST_GLIMPSE_TYPES from '../types/postGlimpseTypes'
import { createNotify, removeNotify } from './notifyActions'

export const createComment = async (dispatch, { postGlimpse, newComment, auth, socket }) => {
    const res = await postData('comment/create', { ...newComment, postGlimpseId: postGlimpse._id, postGlimpseUserId: postGlimpse.user._id }, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    const newPostGlimpse = { ...postGlimpse, comments: [...postGlimpse.comments, { ...res.newComment, user: auth.user }] }
    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE, payload: newPostGlimpse })

    socket.emit('postGlimpseUpdate', newPostGlimpse)
    const message = {
        id: res.newComment._id,
        text: newComment.reply ? 'mentioned you in a comment.' :(newPostGlimpse.glimpse ? 'has commented on your glimpse.':  'has commented on your post.'),
        recipients: newComment.reply ? [newComment.tag._id] : [postGlimpse.user._id],
        url: `/post/${postGlimpse._id}`,
        content: postGlimpse.content,
        media:  postGlimpse.medias[0] 
    }

    createNotify(dispatch, { message, auth, socket })

}

export const updateComment = async (dispatch, { comment, postGlimpse, content, auth }) => {
    const newComments = EditData(postGlimpse.comments, comment._id, { ...comment, content })
    const newPostGlimpse = { ...postGlimpse, comments: newComments }

    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE, payload: newPostGlimpse })
    const res = await patchData(`comment/update/${comment._id}`, { content }, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
}
export const likeComment = async (dispatch, { comment, postGlimpse, auth }) => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] }
    const newComments = dataTools.editData(postGlimpse.comments, comment._id, newComment)
    const newPostGlimpse = { ...postGlimpse, comments: newComments }
    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE, payload: newPostGlimpse })
    const res = await patchData(`comment/${comment._id}/like`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
}
export const removeLikeComment = async (dispatch, { comment, postGlimpse, auth }) => {
    const newComment = { ...comment, likes: dataTools.deleteData(comment.likes, auth.user._id) }
    const newComments = dataTools.editData(postGlimpse.comments, comment._id, newComment)
    const newPostGlimpse = { ...postGlimpse, comments: newComments }
    dispatch({ type: POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE, payload: newPostGlimpse })
    const res = await patchData(`comment/${comment._id}/removelike`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
}

export const deleteComment = async (dispatch, { postGlimpse, comment, auth, socket }) => {

    const deleteArr = [...postGlimpse.comments.filter(cm => cm.reply === comment._id), comment]

    const newPostGlimpse = { ...postGlimpse, comments: postGlimpse.comments.filter(cm => !deleteArr.find(da => cm._id === da._id)) }

    dispatch({ type: POST_GLIMPSE_TYPES.POST_UPDATE, payload: newPostGlimpse })

    socket.emit('postUpdate', newPostGlimpse)
    deleteArr.forEach(async (item) => {
        const res = await deleteData(`comment/delete/${item._id}`, auth.token)
        if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

        const message = {
            id: item._id,
            text: comment.reply ? 'mentioned you in a comment.' : (newPostGlimpse.glimpse ? 'has commented on your glimpse.':  'has commented on your post.'),
            recipients: comment.reply ? [comment.tag._id] : [postGlimpse.user._id],
            url: `/post/${postGlimpse._id}`,
        }

        removeNotify(dispatch, { message, auth, socket })
    })
}
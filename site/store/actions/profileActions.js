import { deleteData, getData, patchData } from "@/utils/fetchData"
import GLOBAL_TYPES from "../types/globalTypes"
import POST_GLIMPSE_TYPES from "../types/postGlimpseTypes"
import PROFILE_TYPES from "../types/profileTypes"
import { dataTools } from "@/utils/tools"
import { filesUpload } from "@/utils/filesUpload"
import HIGHLIGHT_TYPES from "../types/highlightTypes"
import STORY_TYPES from "../types/storyTypes"

export const getUserProfile = async (dispatch, { username, auth }) => {
    dispatch({ type: PROFILE_TYPES.PROFILE_LOADING, payload: true })
    const res = await getData(`/user/username/${username}`, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    if (res.user?._id) {
        const postRes = await getData(`/post-glimpse/posts/user/${res.user._id}`, auth.token)
        if (postRes.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: postRes.error })

        const glimpseRes = await getData(`/post-glimpse/glimpses/user/${res.user._id}`, auth.token)
        if (glimpseRes.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: glimpseRes.error })

        const storyRes = await getData(`/story/user/${res.user._id}`, auth.token)
        if (storyRes.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: storyRes.error })

        const highlightRes = await getData(`/highlight/user/${res.user._id}`, auth.token)
        if (highlightRes.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: highlightRes.error })

        if (username == auth.user.username) {
            const savesRes = await getData(`/post-glimpse/saves`, auth.token)
            if (savesRes.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: savesRes.error })
                dispatch({ type: POST_GLIMPSE_TYPES.SAVE_POST_GLIMPSE_GET, payload: { ...savesRes,page: 2 } })
        }

        dispatch({ type: PROFILE_TYPES.PROFILE_GET, payload: res })

        dispatch({ type: POST_GLIMPSE_TYPES.PROFILE_POST_GET, payload: { ...postRes, _id: res.user._id, page: 2 } })
        dispatch({ type: POST_GLIMPSE_TYPES.PROFILE_GLIMPSE_GET, payload: { ...glimpseRes, _id: res.user._id, page: 2 } })
        dispatch({ type: STORY_TYPES.PROFILE_STORY_GET, payload: { ...storyRes, _id: res.user._id } })
        dispatch({ type: HIGHLIGHT_TYPES.PROFILE_HIGHLIGHT_GET, payload: { ...highlightRes, _id: res.user._id } })
    }
    dispatch({ type: PROFILE_TYPES.PROFILE_LOADING, payload: false })

}
export const updateUserProfile = async (dispatch, { userData, profileImage, auth, socket }) => {
    if (!userData.fullname)
        return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: "Please add your Fullname" })

    if (userData.fullname.length > 25)
        return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: "Your fullName is too long" })

    if (userData.username.length > 25)
        return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: "Your username is too long" })

    if (userData.bio.length > 1000)
        return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: "bio must be smaller than 1000 characters" })

    let profile;
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: true })
    if (profileImage) profile = await filesUpload([profileImage])

    const res = await patchData("/user/update", { ...userData, profileImage: profileImage ? profile[0].url : auth.user.profileImage }, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    if (userData.showActivity != auth.user.showActivity) {
        if (userData.showActivity) {
            socket.emit('showActivity')
        }
        else {
            socket.emit('hideActivity')
        }
    }
    dispatch({
        type: GLOBAL_TYPES.AUTH, payload: {
            ...auth, user: {
                ...auth.user, ...userData,
                profileImage: profileImage ? profile[0].url : auth.user.profileImage,
            }
        }
    })
    dispatch({ type: GLOBAL_TYPES.ALERT_SUCCESS, payload: "profile updated" })

}

export const followRequestUserProfile = async (dispatch, { user, auth, socket }) => {
    if (user.accountPrivate) {
        let newUser = { ...user, requests: [...user.requests.filter(user => user._id !== auth.user._id), auth.user] }
        dispatch({ type: PROFILE_TYPES.PROFILE_UPDATE, payload: newUser })
        socket.emit('userUpdate', newUser)

        const res = await patchData(`user/${user._id}/follow`, null, auth.token)
        if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
    }
    else {
        let newUser = { ...user, followers: [...user.followers, auth.user] }

        dispatch({ type: PROFILE_TYPES.PROFILE_UPDATE, payload: newUser })
        socket.emit('userUpdate', newUser)

        dispatch({ type: GLOBAL_TYPES.AUTH, payload: { ...auth, user: { ...auth.user, followings: [...auth.user.followings, newUser] } } })

        const res = await patchData(`user/${user._id}/follow`, null, auth.token)
        if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

    }
}
export const followRequestAccept = async (dispatch, { user, auth, socket }) => {
    let newUser = { ...user, followings: [...user.followings, auth.user], requests: [...user.requests.filter(user => user._id !== auth.user._id)] }
    dispatch({ type: PROFILE_TYPES.PROFILE_UPDATE, payload: newUser })
    socket.emit('userUpdate', newUser)

    dispatch({ type: GLOBAL_TYPES.AUTH, payload: { ...auth, user: { ...auth.user, followers: [...auth.user.followers, newUser], requests: auth.user.requests.filter(i => i._id !== user._id) } } })

    const res = await patchData(`user/${user._id}/follow/accept`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

}
export const followRequestDecline = async (dispatch, { user, auth, socket }) => {
    let newUser = { ...user, requests: [...user.requests.filter(user => user._id !== auth.user._id)] }
    dispatch({ type: PROFILE_TYPES.PROFILE_UPDATE, payload: newUser })
    socket.emit('userUpdate', newUser)

    dispatch({ type: GLOBAL_TYPES.AUTH, payload: { ...auth, user: { ...auth.user, requests: auth.user.requests.filter(i => i._id !== user._id) } } })

    const res = await patchData(`user/${user._id}/follow/decline`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })

}
export const unfollowUserProfile = async (dispatch, { user, auth, socket }) => {
    let newUser = { ...user, followers: dataTools.deleteData(user.followers, auth.user._id), requests: user.requests.filter(i => i._id !== auth.user._id) }
    dispatch({ type: PROFILE_TYPES.PROFILE_UNFOLLOW, payload: newUser })
    socket.emit('userUpdate', newUser)

    dispatch({ type: GLOBAL_TYPES.AUTH, payload: { ...auth, user: { ...auth.user, followings: dataTools.deleteData(auth.user.followings, newUser._id) } } })
    const res = await patchData(`user/${user._id}/unfollow`, null, auth.token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
}
export const addNoteProfile = async (dispatch, { note, auth, socket }) => {
    const newAuthUser = { ...auth.user, note }
    dispatch({ type: GLOBAL_TYPES.AUTH, payload: { ...auth, user: newAuthUser } })
    socket.emit('authUserUpdate', newAuthUser)
    const res = await patchData(`user/note`, { note }, auth.token)
    if (res.error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error });
}
export const deleteNoteProfile = async (dispatch, { auth, socket }) => {
    const newAuthUser = { ...auth.user, note: '' }
    dispatch({ type: GLOBAL_TYPES.AUTH, payload: { ...auth, user: newAuthUser } })
    socket.emit('authUserUpdate', newAuthUser)
    const res = await deleteData(`user/note`, auth.token)
    if (res.error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error });
}


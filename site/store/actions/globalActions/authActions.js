import validateEmail from "../../../utils/validate";
import { getData, postData } from '../../../utils/fetchData'
import GLOBAL_TYPES from "../../types/globalTypes";
import { resetTheme } from "./themeAction";
import { resetSettings } from "./settingsActions";
import { cookieTools, dataTools } from "@/utils/tools";

export const signUpAction = async (dispatch, userData) => {
    const { fullname, username, email, password, cfpassword } = userData
    if (!fullname || !username || !email || !password || !cfpassword) return dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: "please add email or password" } });

    const validate = validateEmail(email)
    if (!validate) return dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: "email is invalid" } });

    const res = await postData("auth/sign_up", userData);
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: res.error } });

    return dispatch({ type: GLOBAL_TYPES.ALERT_SUCCESS, payload: res.message });
}

export const signInAction = async (dispatch, userData) => {
    const { emailUsername, password } = userData
    if (!emailUsername || !password) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: "please add email or password" });

    const res = await postData("auth/sign_in", userData);
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error });

    if (userData.remember) {
        let accountData = { profileImage: res.user.profileImage, fullname: res.user.fullname, username: res.user.username, _id: res.user._id }
        let previousAccounts = localStorage.getItem('accounts')
        if (previousAccounts) {
            let newAccounts = [accountData, ...JSON.parse(previousAccounts)?.filter(user => user._id !== res.user._id)]
            localStorage.setItem('accounts', JSON.stringify(newAccounts))
            dispatch({ type: GLOBAL_TYPES.ACCOUNTS, payload: newAccounts });
        } else {
            localStorage.setItem("accounts", JSON.stringify([accountData]));
        }
        localStorage.setItem("authenticated", res.user._id);
    }

    dispatch({ type: GLOBAL_TYPES.AUTH, payload: { token: res.access_token, user: res.user } });
    return dispatch({ type: GLOBAL_TYPES.ALERT_SUCCESS, payload: res.message });
}
export const refreshTokenAction = async (dispatch) => {
    const currenUserId = localStorage.getItem('authenticated')
    if (currenUserId) {
        dispatch({ type: GLOBAL_TYPES.LOADING, payload: true })

        const res = await getData(`auth/refresh_token/${currenUserId}`)
        if (res.error) localStorage.removeItem("authenticated");

        dispatch({ type: GLOBAL_TYPES.AUTH, payload: { token: res.access_token, user: res.user } });
        return dispatch({ type: GLOBAL_TYPES.LOADING, payload: false })
    }
}


export const getInitialAccounts = async (dispatch) => {
    let accounts = JSON.parse(localStorage.getItem('accounts'))
    if (accounts) dispatch({ type: GLOBAL_TYPES.ACCOUNTS, payload: accounts });
    return

}

export const removeAccount = async (dispatch, id) => {
    const res = await getData(`auth/sign_out/${id}`)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error });
    let previousAccounts = JSON.parse(localStorage.getItem('accounts'))
    if (previousAccounts && previousAccounts.length == 1) {
        localStorage.removeItem('accounts')
        dispatch({ type: GLOBAL_TYPES.ACCOUNTS, payload: [] });
    }
    else {
        let newAccounts = []
        if (previousAccounts) {
            newAccounts = [...previousAccounts?.filter(user => user._id !== id)]
        }
        localStorage.setItem('accounts', JSON.stringify(newAccounts))
        dispatch({ type: GLOBAL_TYPES.ACCOUNTS, payload: newAccounts });
    }
}

export const signInAccountAction = async (dispatch, id) => {
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: true })

    const res = await getData(`auth/refresh_token/${id}`)
    if (res.error) localStorage.removeItem("authenticated");

    if (res.user) {
        let accountData = { profileImage: res.user.profileImage, fullname: res.user.fullname, username: res.user.username, _id: res.user._id }
        let previousAccounts = localStorage.getItem('accounts')
        if (previousAccounts) {
            let newAccounts = [accountData, ...JSON.parse(previousAccounts)?.filter(user => user._id !== res.user._id)]
            localStorage.setItem('accounts', JSON.stringify(newAccounts))
            dispatch({ type: GLOBAL_TYPES.ACCOUNTS, payload: newAccounts });
        } else {
            localStorage.setItem("accounts", JSON.stringify([accountData]));
        }
        localStorage.setItem("authenticated", res.user._id);

        dispatch({ type: GLOBAL_TYPES.AUTH, payload: { token: res.access_token, user: res.user } });
    }
    return dispatch({ type: GLOBAL_TYPES.LOADING, payload: false })

}
export const signMeAsAccountAction = async (dispatch, id) => {
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: true })
    dispatch({ type: GLOBAL_TYPES.RESET })

    localStorage.setItem('authenticated', id)
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: true })

    const res = await getData(`auth/refresh_token/${id}`)
    if (res.error) localStorage.removeItem("authenticated");

    dispatch({ type: GLOBAL_TYPES.AUTH, payload: { token: res.access_token, user: res.user } });
    return dispatch({ type: GLOBAL_TYPES.LOADING, payload: false })
}


export const signOutAction = async (dispatch, id) => {

    localStorage.removeItem("authenticated");
    dispatch({ type: GLOBAL_TYPES.RESET })
}

export const forgotPasswordAction = async (email) => {
    const res = await postData('auth/forgot_password', { email }, null)
    return {error:res?.error?res.error : '', message:res?.message ? res.message : ''}
}
export const resetPasswordAction = async ({ password, token }) => {
    const res = await postData('auth/reset_password', { password }, token)
    return {error:res?.error?res.error : '', message:res?.message ? res.message : ''}
}

import GLOBAL_TYPES from "@/store/types/globalTypes"
import { getData } from "@/utils/fetchData"

export const getUserSuggestions = async (dispatch, token) => {
    dispatch({ type: GLOBAL_TYPES.SUGGESTIONS_LOADING, payload: true })

    const res = await getData('user_suggestions', token)
    if (res.error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload:res.error })
    dispatch({ type: GLOBAL_TYPES.SUGGESTIONS_GET, payload: res })

    dispatch({ type: GLOBAL_TYPES.SUGGESTIONS_LOADING, payload: false })

}
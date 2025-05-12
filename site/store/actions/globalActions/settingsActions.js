import GLOBAL_TYPES from "../../types/globalTypes";

export const resetSettings = async (dispatch) => {
    await resetMessageSound(dispatch)
    await resetNotifySound(dispatch)
    await resetGlimpseSound(dispatch)
}

export const getIntitialSettings = async (dispatch) => {
    await getInitialNotifySound(dispatch)
    await getInitialMessageSound(dispatch)
    await getInitialGlimpseSound(dispatch)
}

export const defaultNotifySoundSetting = false
export const getInitialNotifySound = async (dispatch) => {
    const notifySound = localStorage.getItem("settings-notifysound");
    if(notifySound){
        dispatch({ type: GLOBAL_TYPES.SETTINGS_NOTIFY_SOUND, payload: JSON.parse(notifySound) });
    }
}
export const resetNotifySound = (dispatch) => {
    dispatch({type: GLOBAL_TYPES.SETTINGS_NOTIFY_SOUND,payload: defaultNotifySoundSetting});
    localStorage.removeItem("settings-notifysound");
  };
export const toggleNotifySound = (state,dispatch) => {
    const toggledNotifySound = !state.settings.notifySound
    dispatch({type: GLOBAL_TYPES.SETTINGS_NOTIFY_SOUND,payload: toggledNotifySound});
    localStorage.setItem("settings-notifysound",toggledNotifySound);
  };


export const defaultMessageSoundSetting = false
export const getInitialMessageSound = async (dispatch) => {
    const messageSound = localStorage.getItem("settings-messagesound");
    if(messageSound){
    dispatch({ type: GLOBAL_TYPES.SETTINGS_MESSAGE_SOUND, payload: JSON.parse(messageSound) });
    }
}
export const resetMessageSound = (dispatch) => {
    dispatch({type: GLOBAL_TYPES.SETTINGS_MESSAGE_SOUND,payload: defaultMessageSoundSetting});
    localStorage.removeItem("settings-messagesound");
  };
export const toggleMessageSound = async (state,dispatch) => {
    const toggledMessageSound = !state.settings.messageSound
    dispatch({type: GLOBAL_TYPES.SETTINGS_MESSAGE_SOUND,payload: toggledMessageSound});
    localStorage.setItem("settings-messagesound", toggledMessageSound);
}

export const defaultGlimpseSoundSetting = false
export const getInitialGlimpseSound = async (dispatch) => {
    const glimpseSound = localStorage.getItem("settings-glimpsesound");
    if(glimpseSound){
    dispatch({ type: GLOBAL_TYPES.SETTINGS_GLIMPSE_SOUND, payload: JSON.parse(glimpseSound) });
    }
}
export const resetGlimpseSound = (dispatch) => {
    dispatch({type: GLOBAL_TYPES.SETTINGS_GLIMPSE_SOUND,payload: defaultGlimpseSoundSetting});
    localStorage.removeItem("settings-glimpsesound");
  };
export const toggleGlimpseSound = async (state,dispatch) => {
    const toggledGlimpseSound = !state.settings.glimpseSound
    dispatch({type: GLOBAL_TYPES.SETTINGS_GLIMPSE_SOUND,payload: toggledGlimpseSound});
    localStorage.setItem("settings-glimpsesound", toggledGlimpseSound);
}
import { defaultMessageSoundSetting, defaultNotifySoundSetting, defaultPostSoundSetting } from "../actions/globalActions/settingsActions";
import { defaultThemeBorderRadius, defaultThemeColor, defaultThemeFontSize, defaultThemeFontType, defaultThemeMode } from "../actions/globalActions/themeAction";

export default {
  theme: {
    mode: defaultThemeMode.slug,
    color: defaultThemeColor.slug,
    font: {
      type: defaultThemeFontType.slug,
      size: defaultThemeFontSize.slug
    },
    borderradius: defaultThemeBorderRadius.slug
  },
  settings: {
    notifySound: defaultNotifySoundSetting,
    messageSound: defaultMessageSoundSetting,
    glimpseSound: defaultPostSoundSetting
  },
  alert: {},
  auth: {},
  accounts:[],
  activity: [],
  currentStory: [],
  socket: {},
  suggestions: {
    loading: false,
    firstLoad:false,
    users: []
  },
};

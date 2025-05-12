import GLOBAL_TYPES from "../../types/globalTypes";

export const resetTheme = async (dispatch) => {
  await resetThemeMode(dispatch)
  await resetThemeColor(dispatch)
  await resetThemeFontType(dispatch)
  await resetThemeFontSize(dispatch)
  await resetThemeBorderRadius(dispatch)
}
export const getInitialTheme = async (dispatch) => {
  await getInitialThemeMode(dispatch)
  await getInitialThemeColor(dispatch)
  await getIntialThemeFontType(dispatch)
  await getIntialThemeFontSize(dispatch)
  await getIntialThemeBorderRadius(dispatch)
}

export const allThemeModes = [
  { name: "Light", slug: "tm-light" },
  { name: "Dark", slug: "tm-dark" }
]
export const defaultThemeMode = allThemeModes[0]
export const getInitialThemeMode = async (dispatch) => {
  const themeMode = localStorage.getItem("theme-mode");
  if (allThemeModes.filter(tm => tm.slug == themeMode)[0]) {
    const html = document.getElementsByTagName('html')[0]
    html.classList.remove(defaultThemeMode.slug)
    html.classList.add(themeMode)
    if (themeMode == 'tm-dark') {
      html.classList.add('dark');
    }
    dispatch({ type: GLOBAL_TYPES.THEME_MODE, payload: themeMode });
  }
}
export const resetThemeMode = async (dispatch) => {
  const themeMode = localStorage.getItem("theme-mode");
  localStorage.removeItem('theme-mode')
  const html = document.getElementsByTagName('html')[0]
  html.classList.remove(themeMode)
  html.classList.add(defaultThemeMode.slug)
  dispatch({ type: GLOBAL_TYPES.THEME_MODE, payload: defaultThemeMode.slug });
}
export const setThemeMode = (state, dispatch, mode) => {
  if (allThemeModes.filter(tm => tm.slug == mode)[0]) {
    const html = document.getElementsByTagName("html")[0];
    html.classList.remove(state.theme.mode);
    if (mode == 'tm-dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    html.classList.add(mode);
    localStorage.setItem("theme-mode", mode);
    dispatch({ type: GLOBAL_TYPES.THEME_MODE, payload: mode });
  }
};


export const allThemeColors = [
  { name: "Silver", slug: "tc-silver", color: '#111' },
  { name: "Blue", slug: "tc-blue", color: '#00f' },
  { name: "red", slug: "tc-red", color: '#f00' },
]
export const defaultThemeColor = allThemeColors[1]
export const getInitialThemeColor = async (dispatch) => {
  const themeColor = localStorage.getItem("theme-color");
  if (allThemeColors.filter(tc => tc.slug == themeColor)[0]) {
    const html = document.getElementsByTagName('html')[0]
    html.classList.remove(defaultThemeColor.slug)
    html.classList.add(themeColor)
    dispatch({ type: GLOBAL_TYPES.THEME_COLOR, payload: themeColor });
  }
}
export const resetThemeColor = async (dispatch) => {
  const themeColor = localStorage.getItem("theme-color");
  localStorage.removeItem('theme-color')
  const html = document.getElementsByTagName('html')[0]
  html.classList.remove(themeColor)
  html.classList.add(defaultThemeColor.slug)
  dispatch({ type: GLOBAL_TYPES.THEME_COLOR, payload: defaultThemeColor.slug });
}
export const setThemeColor = (state, dispatch, color) => {
  if (allThemeColors.filter(tc => tc.slug == color)[0]) {
    const html = document.getElementsByTagName("html")[0];
    html.classList.remove(state.theme.color);
    html.classList.add(color);
    localStorage.setItem("theme-color", color);
    dispatch({ type: GLOBAL_TYPES.THEME_COLOR, payload: color });
  }
};


export const allThemeFontTypes = [
  { name: "tahoma", slug: "tft-tahoma" },
  { name: "verdana", slug: "tft-verdana" },
  { name: "garamond", slug: "tft-garamond" },
  { name: "poppins", slug: "tft-poppins" },
]
export const defaultThemeFontType = allThemeFontTypes[3]
export const getIntialThemeFontType = async (dispatch) => {
  const themeFontType = localStorage.getItem("theme-fonttype");
  if (allThemeFontTypes.filter(tft => tft.slug == themeFontType)[0]) {
    const html = document.getElementsByTagName('html')[0]
    html.classList.remove(defaultThemeFontType.slug)
    html.classList.add(themeFontType)
    dispatch({ type: GLOBAL_TYPES.THEME_FONT_TYPE, payload: themeFontType });
  }
}
export const resetThemeFontType = async (dispatch) => {
  const themeFontType = localStorage.getItem("theme-fonttype");
  localStorage.removeItem('theme-fonttype')
  const html = document.getElementsByTagName('html')[0]
  html.classList.remove(themeFontType)
  html.classList.add(defaultThemeFontType.slug)
  dispatch({ type: GLOBAL_TYPES.THEME_FONT_TYPE, payload: defaultThemeFontType.slug });
}
export const setThemeFontType = (state, dispatch, fonttype) => {
  if (allThemeFontTypes.filter(tft => tft.slug == fonttype)[0]) {
    const html = document.getElementsByTagName("html")[0];
    html.classList.remove(state.theme.font.type);
    html.classList.add(fonttype);
    localStorage.setItem("theme-fonttype", fonttype);
    dispatch({ type: GLOBAL_TYPES.THEME_FONT_TYPE, payload: fonttype });
  }
};

export const allThemeFontSizes = [
  { name: "small", slug: "tfs-xs" },
  { name: "medium", slug: "tfs-md" },
  { name: "large", slug: "tfs-lg" },
]
export const defaultThemeFontSize = allThemeFontSizes[1]
export const getIntialThemeFontSize = async (dispatch) => {
  const themeFontSize = localStorage.getItem("theme-fontsize");
  if (allThemeFontSizes.filter(tfs => tfs.slug == themeFontSize)[0]) {
    const html = document.getElementsByTagName('html')[0]
    html.classList.remove(defaultThemeFontSize.slug)
    html.classList.add(themeFontSize)
    dispatch({ type: GLOBAL_TYPES.THEME_FONT_SIZE, payload: themeFontSize });
  }
}
export const resetThemeFontSize = async (dispatch) => {
  const themeFontSize = localStorage.getItem("theme-fontsize");
  localStorage.removeItem('theme-fontsize')
  const html = document.getElementsByTagName('html')[0]
  html.classList.remove(themeFontSize)
  html.classList.add(defaultThemeFontSize.slug)
  dispatch({ type: GLOBAL_TYPES.THEME_FONT_SIZE, payload: defaultThemeFontSize.slug });
}
export const setThemeFontSize = (state, dispatch, fontsize) => {
  if (allThemeFontSizes.filter(tfs => tfs.slug == fontsize)[0]) {
    const html = document.getElementsByTagName("html")[0];
    html.classList.remove(state.theme.font.size);
    html.classList.add(fontsize);
    localStorage.setItem("theme-fontsize", fontsize);
    dispatch({ type: GLOBAL_TYPES.THEME_FONT_SIZE, payload: fontsize });
  }
};


export const allThemeBorderRadius = [
  { name: "None", slug: "tbr-sm" },
  { name: "Medium", slug: "tbr-md" },
  { name: "Large", slug: "tbr-lg" }
]
export const defaultThemeBorderRadius = allThemeBorderRadius[1]
export const getIntialThemeBorderRadius = async (dispatch) => {
  const themeBorderRadius = localStorage.getItem("theme-borderradius");
  if (allThemeBorderRadius.filter(tbr => tbr.slug == themeBorderRadius)[0]) {
    const html = document.getElementsByTagName('html')[0]
    html.classList.remove(defaultThemeBorderRadius.slug)
    html.classList.add(themeBorderRadius)
    dispatch({ type: GLOBAL_TYPES.THEME_BORDER_RADIUS, payload: themeBorderRadius });
  }
}
export const resetThemeBorderRadius = async (dispatch) => {
  const themeBorderRadius = localStorage.getItem("theme-borderradius");
  localStorage.removeItem('theme-borderradius')
  const html = document.getElementsByTagName('html')[0]
  html.classList.remove(themeBorderRadius)
  html.classList.add(defaultThemeBorderRadius.slug)
  dispatch({ type: GLOBAL_TYPES.THEME_BORDER_RADIUS, payload: defaultThemeBorderRadius.slug });
}
export const setThemeBorderRadius = (state, dispatch, borderradius) => {
  if (allThemeBorderRadius.filter(tbr => tbr.slug == borderradius)[0]) {
    const html = document.getElementsByTagName("html")[0];
    html.classList.remove(state.theme.borderradius);
    html.classList.add(borderradius);
    localStorage.setItem("theme-borderradius", borderradius);
    dispatch({ type: GLOBAL_TYPES.THEME_BORDER_RADIUS, payload: borderradius });
  }
};

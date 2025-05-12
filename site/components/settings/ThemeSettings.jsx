import useStore from "@/hooks/useStore";
import React from "react";
import {
  allThemeModes,
  allThemeColors,
  allThemeBorderRadius,
  allThemeFontSizes,
  allThemeFontTypes,
  setThemeMode,
  setThemeColor,
  setThemeBorderRadius,
  setThemeFontSize,
  setThemeFontType,
} from "@/store/actions/globalActions/themeAction";

const ThemeSettings = () => {
  const { state, dispatch } = useStore();
  return (
      <div className="bg-background-light rounded-custom w-full p-8 gap-8 flex flex-col">
        <h5 className="text-xl">Theme</h5>

        <div className="flex-col flex gap-2">
          <div className="flex item-center flex-grow justify-between">
            <div className="text-text-light flex-grow w-full ">
              Mode
            </div>
            
            <select
              onChange={(e) => setThemeMode(state, dispatch, e.target.value)}
              value={state.theme.mode}
              className="block appearance-none capitalize min-w-[200px] bg-background-extralight border border-border-outline/30 px-4 py-2 pr-8 rounded-custom leading-tight focus:outline-none focus:shadow-outline"
            >
              {allThemeModes.map((tc, i) => (
                <option key={i} value={tc.slug}>
                  {tc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex item-center flex-grow justify-between">
            <div className="text-text-light flex-grow w-full ">
              Color
            </div>
            
            <select
              onChange={(e) => setThemeColor(state, dispatch, e.target.value)}
              value={state.theme.color}
              className="block appearance-none capitalize min-w-[200px] bg-background-extralight border border-border-outline/30 px-4 py-2 pr-8 rounded-custom leading-tight focus:outline-none focus:shadow-outline"
            >
              {allThemeColors.map((tc, i) => (
                <option key={i} value={tc.slug}>
                  {tc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex item-center flex-grow justify-between">
            <div className="text-text-light flex-grow w-full ">
              Font Type
            </div>
            
            <select
              onChange={(e) => setThemeFontType(state, dispatch, e.target.value)}
              value={state.theme.font.type}
              className="block appearance-none capitalize min-w-[200px] bg-background-extralight border border-border-outline/30 px-4 py-2 pr-8 rounded-custom leading-tight focus:outline-none focus:shadow-outline"
            >
              {allThemeFontTypes.map((tft, i) => (
                <option key={i} value={tft.slug}>
                  {tft.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex item-center flex-grow justify-between">
            <div className="text-text-light flex-grow w-full ">
              Font Size
            </div>
            
            <select
              onChange={(e) => {setThemeFontSize(state, dispatch, e.target.value)}}
              value={state.theme.font.size}
              className="block appearance-none capitalize min-w-[200px] bg-background-extralight border border-border-outline/30 px-4 py-2 pr-8 rounded-custom leading-tight focus:outline-none focus:shadow-outline"
            >
              {allThemeFontSizes.map((tfs, i) => (
                <option key={i} value={tfs.slug}>
                  {tfs.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex item-center flex-grow justify-between">
            <div className="text-text-light flex-grow w-full ">
              Border Radius
            </div>
            
            <select
              onChange={(e) => setThemeBorderRadius(state, dispatch, e.target.value)}
              value={state.theme.borderradius}
              className="block appearance-none capitalize min-w-[200px] bg-background-extralight border border-border-outline/30 px-5 py-2 pr-8 rounded-custom leading-tight focus:outline-none focus:shadow-outline"
            >
              {allThemeBorderRadius.map((tbr, i) => (
                <option key={i} value={tbr.slug}>
                  {tbr.name}
                </option>
              ))}
            </select>
          </div>
        
        </div>
      </div>
  );
};

export default ThemeSettings;

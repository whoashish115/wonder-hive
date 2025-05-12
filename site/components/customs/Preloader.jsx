import { Context } from "@/store/provider";
import { documentTools } from "@/utils/tools";
import React, { useContext, useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";

const Preloader = () => {
  const { state } = useContext(Context);
  const [themeColor, setThemeColor] = useState("");
  
  useEffect(() => {
    var style = getComputedStyle(document.body);
    setThemeColor(documentTools.rgbaToHex(style.getPropertyValue("--theme")));
  }, [state.theme]);
  return (
    <div className="flex justify-center items-center w-full h-full">
     <HashLoader
        loading={true}
        color={themeColor}
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Preloader;

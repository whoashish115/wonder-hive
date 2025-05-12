import { Context } from "@/store/provider";
import { documentTools } from "@/utils/tools";
import React, { useContext, useEffect, useState } from "react";
import RingLoader from "react-spinners/RingLoader";

const Loader = () => {
  const { state } = useContext(Context);
  const [themeColor, setThemeColor] = useState("");
  
  useEffect(() => {
    var style = getComputedStyle(document.body);
    setThemeColor(documentTools.rgbaToHex(style.getPropertyValue("--theme")));
  }, [state.theme]);

  return (
    <div className="flex justify-center items-center w-full h-full">
     <RingLoader
        loading={true}
        color={themeColor}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;

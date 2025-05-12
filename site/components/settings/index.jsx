import React, { useEffect } from "react";
import ThemeSettings from "./ThemeSettings";
import GeneralSettings from "./GeneralSettings";
import AccountSettings from "./AccountSettings";

const Settings = () => {
  useEffect(() => {
    const element = document?.querySelector('#custom-body')
    if(element){
      element.scrollTop =0;
    }
  }, []);
  return (
    <div className="flex flex-col w-full gap-4">
     <AccountSettings/>
     <GeneralSettings/>
     <ThemeSettings/>
    </div>
  );
};

export default Settings;

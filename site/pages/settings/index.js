import React from "react";

import { Seo, Settings as SettingsComponent } from "../../components";

const Settings = (props) => {
  return (
    <>
      <Seo title="Settings" />
      <SettingsComponent {...props} />
    </>
  );
};

export default Settings;

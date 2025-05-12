import React from "react";

import { Seo, Notifications as NotificationsComponent } from "../../components";

const Notifications = (props) => {
  return (
    <>
      <Seo title="welcome" />
      <NotificationsComponent {...props} />
    </>
  );
};

export default Notifications;

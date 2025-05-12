import React from "react";

import { Seo, NotificationsRequests as NotificationsRequestsComponent } from "../../components";

const NotificationsRequests = (props) => {
  return (
    <>
      <Seo title="welcome" />
      <NotificationsRequestsComponent {...props} />
    </>
  );
};

export default NotificationsRequests;

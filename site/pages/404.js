import React from "react";

import { Seo, NotFound as NotFoundComponent } from "../components";

const NotFound = (props) => {
  return (
    <>
      <Seo title="404" description="page not found" />
      <NotFoundComponent {...props} />
    </>
  );
};

export default NotFound;

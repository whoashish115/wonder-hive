import React from "react";

import {Seo, InternalServerError as InternalServerErrorComponent } from "../components";

const InternalServerError = (props) => {
  return (
    <>
      <Seo title="500" description="internal server error" />
      <InternalServerErrorComponent {...props} />
    </>
  );
};

export default InternalServerError;

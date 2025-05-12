import React from "react";

import { Seo, CreateEditPostGlimpse as EditGlimpseComponent } from "../../../components";

const EditGlimpse = (props) => {
  return (
    <>
      <Seo title="Create Post" />
      <EditGlimpseComponent {...props} />
    </>
  );
};

export default EditGlimpse;

import React from "react";

import { Seo, CreateEditPostGlimpse as EditPostComponent } from "../../../components";

const EditPost = (props) => {
  return (
    <>
      <Seo title="Create Post" />
      <EditPostComponent {...props} />
    </>
  );
};

export default EditPost;

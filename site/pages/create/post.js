import React from "react";

import { Seo, CreateEditPostGlimpse as CreatePostComponent } from "../../components";

const CreatePost = (props) => {
  return (
    <>
      <Seo title="Create Post" />
      <CreatePostComponent {...props} />
    </>
  );
};

export default CreatePost;

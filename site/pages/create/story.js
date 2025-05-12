import React from "react";

import { Seo, CreateEditStory as CreateStoryComponent } from "../../components";

const CreateStory = (props) => {
  return (
    <>
      <Seo title="Create Story" />
      <CreateStoryComponent {...props} />
    </>
  );
};

export default CreateStory;

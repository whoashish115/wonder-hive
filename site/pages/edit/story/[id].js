import React from "react";

import { Seo, CreateEditStory as EditStoryComponent } from "../../../components";

const EditStory = (props) => {
  return (
    <>
      <Seo title="Create Story" />
      <EditStoryComponent {...props} />
    </>
  );
};

export default EditStory;

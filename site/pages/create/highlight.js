import React from "react";

import { Seo, CreateEditHighlight as CreateHighlightComponent } from "../../components";

const CreateHighlight = (props) => {
  return (
    <>
      <Seo title="Create Highlight" />
      <CreateHighlightComponent {...props} />
    </>
  );
};

export default CreateHighlight;

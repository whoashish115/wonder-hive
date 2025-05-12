import React from "react";
import { Seo, CreateEditHighlight as EditHighlightComponent } from "../../../components";

const EditHighlight = (props) => {
  return (
    <>
      <Seo title="Edit Highlight" />
      <EditHighlightComponent {...props} />
    </>
  );
};

export default EditHighlight;

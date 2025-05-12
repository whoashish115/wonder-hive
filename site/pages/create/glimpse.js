import React from "react";

import { Seo, CreateEditPostGlimpse as CreateGlimpseComponent } from "../../components";

const CreateGlimpse = (props) => {
  return (
    <>
      <Seo title="Create Glimpse" />
      <CreateGlimpseComponent {...props} />
    </>
  );
};

export default CreateGlimpse;

import React from "react";

import { Seo, GlimpsePage as GlimpsePageComponent } from "../../components";

const GlimpsePage = (props) => {
  return (
    <>
      <Seo title="Glimpses" />
      <GlimpsePageComponent {...props} />
    </>
  );
};

export default GlimpsePage;

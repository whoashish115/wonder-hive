import React from "react";

import { Seo, Explore as ExploreComponent } from "../components";

const Explore = (props) => {
  return (
    <>
      <Seo title="welcome" />
      <ExploreComponent {...props} />
    </>
  );
};

export default Explore;

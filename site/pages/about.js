import React from "react";

import { Seo, About as AboutComponent } from "../components";

const About = (props) => {
  return (
    <>
      <Seo title="About" />
      <AboutComponent {...props} />
    </>
  );
};

export default About;

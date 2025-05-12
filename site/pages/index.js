import React from "react";

import { Seo, Home as HomeComponent } from "../components";

const Home = (props) => {
  return (
    <>
      <Seo title="Dashboard" />
      <HomeComponent {...props} />
    </>
  );
};

export default Home;

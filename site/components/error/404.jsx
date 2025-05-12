import React from "react";
import ErrorPage from "./index"

const NotFound = () => {
  return (
    <ErrorPage
      title="404"
      subtitle="not found"
      description="Apologies, but it seems you&apos;ve reached a dead end on our website. The page you were searching for has taken a detour, but you can easily return to familiar territory by clicking the 'Home' button or using the navigation menu to explore our site further. We're here to help you find the information you need."
      button={true}
    />
  );
};

export default NotFound;

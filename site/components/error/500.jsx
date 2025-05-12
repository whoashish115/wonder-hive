import React from "react";
import ErrorPage from "./index"

const InternalServerError = () => {
  return (
    <ErrorPage
      title="500"
      subtitle='Internal Server Error'
      description="Sorry, we&apos;re encountering some technical difficulties on our server. The page you were trying to access is currently unavailable due to an internal server error. Our team is working diligently to resolve this issue, and we apologize for any inconvenience. In the meantime, please feel free to return to the homepage or explore other areas of our website. We appreciate your patience and understanding."
    />
  );
};

export default InternalServerError;

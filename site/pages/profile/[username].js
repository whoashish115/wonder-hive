import React from "react";

import { Seo, Profile as ProfileComponent } from "../../components";

const Profile = (props) => {
  return (
    <>
      <Seo title="Profile" />
      <ProfileComponent {...props} />
    </>
  );
};

export default Profile;

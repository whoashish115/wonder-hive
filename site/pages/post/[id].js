import React from "react";

import { Seo, PostPage as PostPageComponent } from "../../components";

const PostPage = (props) => {
  return (
    <>
      <Seo title="User Post" />
      <PostPageComponent {...props} />
    </>
  );
};

export default PostPage;

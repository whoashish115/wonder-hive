import React from "react";

import { Seo, ConversationBase as ConversationBaseComponent } from "../../components";

const ConversationBase = (props) => {
  return (
    <>
      <Seo title="Chats User" />
      <ConversationBaseComponent {...props} />
    </>
  );
};

export default ConversationBase;

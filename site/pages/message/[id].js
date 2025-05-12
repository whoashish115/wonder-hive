import React from "react";

import { Seo, ConversationMain as ConversationMainComponent } from "../../components";

const ConversationMain = (props) => {
  return (
    <>
      <Seo title="Chats User" />
      <ConversationMainComponent {...props} />
    </>
  );
};

export default ConversationMain;

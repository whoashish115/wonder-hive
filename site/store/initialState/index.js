import globalIntialState from "./globalIntialState";
import messageInitialState from "./messageInitialState";
import notifyInitialState from "./notifyInitialState";
import postGlimpse from "./postGlimpseInitialState";
import profileInitialState from "./profileInitialState";
import highlightInitialState from "./highlightInitialState";
import conversationInitialState from "./conversationInitialState";
import storyInitialState from "./storyInitialState";

const rootState = {
   ...globalIntialState,
   ...profileInitialState,
   ...notifyInitialState,
   ...storyInitialState,
   ...highlightInitialState,
   ...postGlimpse,
   ...conversationInitialState,
   ...messageInitialState,
};

export default rootState

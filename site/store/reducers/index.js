import globalReducer from "./globalReducer";
import messageReducer from "./messageReducer";
import notifyReducer from "./notifyReducer";
import postGlimpseReducer from "./postGlimpseReducer";
import profileReducer from "./profileReducer";
import storyReducer from "./storyReducer";
import conversationReducer from "./conversationReducer";
import highlightReducer from "./highlightReducer";

const combineReducers = (...reducers) => (state, action) =>
  reducers.reduce((acc, nextReducer) => nextReducer(acc, action), state);

const rootReducer = combineReducers(
    globalReducer,
    profileReducer,
    conversationReducer,
    postGlimpseReducer,
    highlightReducer,
    notifyReducer,
    messageReducer,
    storyReducer,
)

export default rootReducer
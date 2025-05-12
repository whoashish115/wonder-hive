import { createContext, useReducer } from "react";

import rootState from "./initialState"
import rootReducer from "./reducers"
export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer,  rootState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

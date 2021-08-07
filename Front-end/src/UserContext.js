import React, { createContext, useReducer } from "react";
import reducer, { initialState } from "./Reducer";

export const UserContext = createContext();

export const UserProvider = ({ children }) => (
  <UserContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </UserContext.Provider>
);

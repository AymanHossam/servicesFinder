import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";

import Nav from './src/Nav';
import servicesReducer from './src/store/reducers/servicesReducer';
import usersReducer from './src/store/reducers/usersReducer';

const reducers = combineReducers({
  services: servicesReducer,
  users: usersReducer
})

// const logger = createLogger({
//   diff: true
// })

const store = createStore(reducers)


export default function App() {

  return (
    <Provider store={ store }>
      <Nav />
    </Provider>

  );
}

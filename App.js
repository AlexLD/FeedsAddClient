import React from 'react';
import StackNav from './components/Navigation/StackNav';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <StackNav></StackNav>
      </Provider>
    ); 
  }
}


import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory, match} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import io from 'socket.io-client';
import reducer from './reducer';
import {setClientId, setState, setConnectionState} from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import getClientId from './client_id';
import {routes} from './routes';
import {Map} from 'immutable';

// require('./style.css');
const socket = io(`${location.protocol}//${location.hostname}:8090`);
socket.on('state', state =>
  store.dispatch(setState(state))
);
[
  'connect',
  'connect_error',
  'connect_timeout',
  'reconnect',
  'reconnecting',
  'reconnect_error',
  'reconnect_failed'
].forEach(ev =>
  socket.on(ev, () => store.dispatch(setConnectionState(ev, socket.connected)))
);

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket)
)(createStore);
const store = createStoreWithMiddleware(reducer, window.__INITIAL_STATE__);
store.dispatch(setClientId(getClientId()));

match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
  ReactDOM.render(
    <Provider store={store}>
      <Router {...renderProps}/>
    </Provider>,
    document.getElementById('app')
  );
})


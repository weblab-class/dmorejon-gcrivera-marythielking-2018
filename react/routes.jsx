import React from 'react';
import App from './App.jsx';
import Homepage from './Pages/Homepage.jsx';
import LogIn from './Pages/LogIn.jsx';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

export default (
  <Router history={browserHistory} >
    <Route path='/' component={App}>
      <IndexRoute component={Homepage} />
      <Route path="login"
        component={LogIn} />
    </Route>
  </Router>
);

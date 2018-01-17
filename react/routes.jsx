import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './App.jsx';
import Homepage from './Pages/Homepage.jsx';
import LogIn from './Pages/LogIn.jsx';
import MapView from './Pages/MapView.jsx';
import CreateGreenspace from './Pages/CreateGreenspace.jsx';
import GreenspaceInfo from './Pages/GreenspaceInfo.jsx';

export default (
  <Router history={browserHistory} >
    <Route path='/' component={App}>
      <IndexRoute component={Homepage} />
      <Route path="login"
        component={LogIn} />
      <Route path="map"
        component={MapView}/>
      <Route path="map/create/:lat,:lng"
        component={CreateGreenspace} />
      <Route path="map/:lat,:lng"
        component={GreenspaceInfo} />
    </Route>
  </Router>
);

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './App.jsx';
import Services from '../services';
import Homepage from './Pages/Homepage.jsx';
import LogIn from './Pages/LogIn.jsx';
import Loading from './Pages/Loading.jsx';
import MapView from './Pages/MapView.jsx';
import CreateGreenspace from './Pages/CreateGreenspace.jsx';
import GreenspaceInfo from './Pages/GreenspaceInfo.jsx';
import CreateEvent from './Pages/CreateEvent.jsx';
import EventView from './Pages/EventView.jsx';
import ReviewView from './Pages/ReviewView.jsx';
import CreateReview from './Pages/CreateReview.jsx';
import UserView from './Pages/UserView.jsx';
import Discover from './Pages/DiscoverPage.jsx';
import NotFound from './Pages/NotFound.jsx';

const checkUser = (nextState, replace, callback) => {
  Services.user.info()
    .then((res) => {
      if (!res.content) {
        replace('/login');
      }
      callback();
    }).catch((err => {
      console.log("Err in checkUser(): ", err);
      callback();
    }));
};

const checkGID = (nextState, callback, component) => {
  Services.greenspace.info(nextState.params.gid)
    .then((res) => {
      callback(null, component);
    }).catch((err) => {
      callback(null, NotFound);
    });
};

export default (
  <Router history={browserHistory} >
    <Route path='/' component={App}>
      <IndexRoute component={Homepage} />
      <Route path="login"
        component={LogIn} />
      <Route path="loading"
          component={Loading} />
      <Route path="map"
        component={MapView}/>
      <Route path="map/:lat,:lng/create"
        component={CreateGreenspace}
        onEnter={checkUser} />
      <Route path="map/:gid"
        getComponent={(nextState, cb) => checkGID(nextState, cb, GreenspaceInfo)} />
      <Route path="map/:gid/event/create"
        getComponent={(nextState, cb) => checkGID(nextState, cb, CreateEvent)}
        onEnter={checkUser} />
      <Route path="map/:gid/event/:eventId"
        getComponent={(nextState, cb) => checkGID(nextState, cb, EventView)} />
      <Route path="map/:gid/reviews"
        getComponent={(nextState, cb) => checkGID(nextState, cb, ReviewView)} />
      <Route path="map/:gid/reviews/create"
        getComponent={(nextState, cb) => checkGID(nextState, cb, CreateReview)}
        onEnter={checkUser} />
      <Route path="user/view/:id"
        component={UserView}
        onEnter={checkUser} />
      <Route path="discover"
        component={Discover}
        onEnter={checkUser} />
      <Route path="*"
        component={NotFound} />
    </Route>
  </Router>
);

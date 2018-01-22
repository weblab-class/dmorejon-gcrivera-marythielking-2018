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
import EditEvent from './Pages/EditEvent.jsx';
import ReviewView from './Pages/ReviewView.jsx';
import CreateReview from './Pages/CreateReview.jsx';
import RequireLogIn from './Pages/RequireLogIn.jsx';
import UserView from './Pages/UserView.jsx';
import NotFound from './Pages/NotFound.jsx';

const checkUser = (nextState, replace, callback) => {
    console.log(nextState);
    Services.user.info()
      .then((res) => {
        if (!res.content) {
          replace('/login/require');
        }
        callback();
      }).catch((err => {
        console.log("Err in checkUser(): ", err);
        callback();
      }));
};

export default (
  <Router history={browserHistory} >
    <Route path='/' component={App}>
      <IndexRoute component={Homepage} />
      <Route path="login"
        component={LogIn} />
      <Route path="login/require"
          component={RequireLogIn} />
      <Route path="loading"
          component={Loading} />
      <Route path="map"
        component={MapView}/>
      <Route path="map/:lat,:lng/create"
        component={CreateGreenspace}
        onEnter={checkUser} />
      <Route path="map/:gid"
        component={GreenspaceInfo} />
      <Route path="map/:gid/event/create"
        component={CreateEvent}
        onEnter={checkUser} />
      <Route path="map/:gid/event/:eventId"
        component={EventView} />
      <Route path="map/:gid/event/:eventId/edit"
        component={EditEvent} />
      <Route path="map/:gid/reviews"
        component={ReviewView} />
      <Route path="map/:gid/reviews/create"
        component={CreateReview}
        onEnter={checkUser} />
      <Route path="user/:id"
        component={UserView} />
      <Route path="*"
        component={NotFound} />
    </Route>
  </Router>
);

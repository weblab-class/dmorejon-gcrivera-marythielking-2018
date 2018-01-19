import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './App.jsx';
import Homepage from './Pages/Homepage.jsx';
import LogIn from './Pages/LogIn.jsx';
import Loading from './Pages/Loading.jsx';
import MapView from './Pages/MapView.jsx';
import CreateGreenspace from './Pages/CreateGreenspace.jsx';
import GreenspaceInfo from './Pages/GreenspaceInfo.jsx';
import CreateEvent from './Pages/CreateEvent.jsx';
import EventView from './Pages/EventView.jsx';
import EditEvent from './Pages/EditEvent.jsx';
import ReviewsView from './Pages/ReviewsView.jsx';
import CreateReview from './Pages/CreateReview.jsx';
import UserView from './Pages/UserView.jsx';
import NotFound from './Pages/NotFound.jsx';

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
        component={CreateGreenspace} />
      <Route path="map/:gid"
        component={GreenspaceInfo} />
      <Route path="map/:gid/event/create"
        component={CreateEvent} />
      <Route path="map/:gid/event/:eventId"
        component={EventView} />
      <Route path="map/:gid/event/:eventId/edit"
        component={EditEvent} />
      <Route path="map/:gid/reviews"
        component={ReviewsView} />
      <Route path="map/:gid/reviews/create"
        component={CreateReview} />
      <Route path="user/:id"
        component={UserView} />
      <Route path="*"
        component={NotFound} />
    </Route>
  </Router>
);

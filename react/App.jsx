import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Services from '../services';
import Header from './Components/Header.jsx';
import LeafletMap from './Components/LeafletMap.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: null,
      showMap: true,
      mapViewOnly: false,
      placeMarkers: true,
      newMarker: false,
    };

    this.logInUser = this.logInUser.bind(this);
    this.logOutUser = this.logOutUser.bind(this);
    this.createGreenspace = this.createGreenspace.bind(this);
    this.setMapPlaceMarkers = this.setMapPlaceMarkers.bind(this);
    this.setMapViewOnly = this.setMapViewOnly.bind(this);
  }

  logInUser() {
    this.props.router.push(`/map/${window.location.search}`);
  }

  logOutUser() {
    this.setState({ currentUser: null });
  }

  createGreenspace(name, lat, lng) {
    Services.greenspace.create(name, [lat, lng])
      .then((res) => {
        this.setState({newMarker: true});
        this.props.router.push(`/map/${res.content._id}/${window.location.search}`);
      });
  }

  setMapPlaceMarkers(placeMarkers) {
    if (placeMarkers !== this.state.placeMarkers) {
      this.setState({ placeMarkers });
    }
  }

  setMapViewOnly(viewOnly) {
    if (viewOnly !== this.state.mapViewOnly) {
      this.setState({ mapViewOnly: viewOnly });
    }
  }

  render(){
    const {
      showMap,
      currentUser,
      mapViewOnly,
      placeMarkers,
      newMarker,
    } = this.state;

    return (
      <div>
        <Header
          currentUser={currentUser}
          logOutUser={this.logOutUser}
        />
        <div id="content">
          <LeafletMap
            display={showMap}
            viewOnly={mapViewOnly}
            placeMarkers={placeMarkers}
            newMarker={newMarker}
          />
          {React.cloneElement(this.props.children, {
            logInUser: this.logInUser,
            createGreenspace: this.createGreenspace,
            setMapViewOnly: this.setMapViewOnly,
            setMapPlaceMarkers: this.setMapPlaceMarkers,
          })}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.any,
}

export default withRouter(App);

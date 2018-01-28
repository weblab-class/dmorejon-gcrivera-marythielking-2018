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
      resetMarkers: false,
      setMapView: null,
    };

    Services.user.info()
      .then((res) => {
        if (res.content) {
          this.setState({
            currentUser: res.content
          });
        }
      });

    this.createGreenspace = this.createGreenspace.bind(this);
    this.getGreenspaceInfo = this.getGreenspaceInfo.bind(this);
    this.setMapPlaceMarkers = this.setMapPlaceMarkers.bind(this);
    this.setMapViewOnly = this.setMapViewOnly.bind(this);
    this.setMapViewFn = this.setMapViewFn.bind(this);
  }

  createGreenspace(name, lat, lng) {
    Services.greenspace.create(name, [lat, lng])
      .then((res) => {
        this.setState({newMarker: true});
        this.props.router.push(`/map/${res.content._id}/${window.location.search}`);
      });
  }

  getGreenspaceInfo(gid, callback) {
    Services.greenspace.info(gid)
      .then((res) => {
        callback({
          greenspaceName: res.content.name,
          lat: res.content.location[0],
          lng: res.content.location[1],
        });
      })
      .catch((err) => console.log(err.error.err));
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

  setMapViewFn(loc) {
    this.setState({ setMapView: loc });
  }

  render(){
    const {
      showMap,
      currentUser,
      mapViewOnly,
      placeMarkers,
      newMarker,
      resetMarkers,
      setMapView,
    } = this.state;

    return (
      <div>
        <Header
          currentUser={currentUser}
        />
        <div id="content">
          <LeafletMap
            display={showMap}
            viewOnly={mapViewOnly}
            placeMarkers={placeMarkers}
            newMarker={newMarker}
            resetMarkers={resetMarkers}
            currentUser={currentUser}
            setMapView={setMapView}
          />
          {React.cloneElement(this.props.children, {
            currentUser: currentUser,
            createGreenspace: this.createGreenspace,
            getGreenspaceInfo: this.getGreenspaceInfo,
            setMapViewOnly: this.setMapViewOnly,
            setMapPlaceMarkers: this.setMapPlaceMarkers,
            setMapViewFn: this.setMapViewFn,
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

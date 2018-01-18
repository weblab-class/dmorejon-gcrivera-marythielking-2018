import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Header from './Components/Header.jsx';
import LeafletMap from './Components/LeafletMap.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: "Mary",
      showMap: true,
      mapViewOnly: false,
    };

    this.logInUser = this.logInUser.bind(this);
    this.logOutUser = this.logOutUser.bind(this);
    this.createGreenspace = this.createGreenspace.bind(this);
    this.setMapViewOnly = this.setMapViewOnly.bind(this);
  }

  logInUser(username, email) {
    this.setState({ currentUser: username });
    this.props.router.push(`/map`);
  }

  logOutUser() {
    this.setState({ currentUser: null });
  }

  createGreenspace(name, lat, lng) {
    console.log(`greenspace ${name} created at ${lat}, ${lng}`);
    this.props.router.push(`/map`);
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
          />
          {React.cloneElement(this.props.children, {
            logInUser: this.logInUser,
            createGreenspace: this.createGreenspace,
            setMapViewOnly: this.setMapViewOnly,
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

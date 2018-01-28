import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Components/Sidebar.jsx';

class Discover extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <h1>Discover</h1>
      </Sidebar>
    );
  }
}

Discover.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
}

export default Discover;

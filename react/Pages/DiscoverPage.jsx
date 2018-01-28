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
        <div className="section-header">Discover</div>
      </Sidebar>
    );
  }
}

Discover.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
}

export default Discover;

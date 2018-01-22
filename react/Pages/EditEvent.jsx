import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Components/Sidebar.jsx';

class EditEvent extends Component {
  render(){
    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <h1 className="section-header">EditEvent</h1>
      </Sidebar>
    );
  }
}

EditEvent.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
}

export default EditEvent;

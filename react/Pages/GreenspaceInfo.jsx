import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Components/Sidebar.jsx';

class GreenspaceInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      lat: props.params.lat,
      lng: props.params.lng,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.params !== this.props.params) {
      this.state.lat = newProps.params.lat;
      this.state.lng = newProps.params.lng;
    }
  }

  render(){
    const { lat, lng } = this.state;
    return (
      <Sidebar>
        <h1>Greenspace Info</h1>
      </Sidebar>
    );
  }
}

GreenspaceInfo.propTypes = {
}

export default GreenspaceInfo;

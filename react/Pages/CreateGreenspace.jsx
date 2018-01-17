import React, { Component } from 'react';
import Sidebar from '../Components/Sidebar.jsx';

class CreateGreenspace extends Component {
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
    return (
      <Sidebar>
        <h1>Create Greenspace</h1>
        <div>Latitude: {this.state.lat}</div>
        <div>Longitude: {this.state.lng}</div>
      </Sidebar>
    );
  }
}

export default CreateGreenspace;

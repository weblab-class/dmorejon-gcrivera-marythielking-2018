import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Components/Sidebar.jsx';

class CreateGreenspaceLogin extends Component {
  render(){
    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <div id="no-greenspace-text">There's no greenspace here yet! Please log in to create a greenspace.</div>
        <a href="/auth/facebook" className="fb-btn btn">
          <img src="/images/FB-f-Logo__white_1024.png" height="20px" className="fb-logo" />
          Log in with Facebook
        </a>
      </Sidebar>
    );
  }
}

CreateGreenspaceLogin.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
}

export default CreateGreenspaceLogin;

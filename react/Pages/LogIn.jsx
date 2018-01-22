import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../Components/PopUp.jsx';

class LogIn extends Component {
  render(){
    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly}>
        <h1 className="section-header">Welcome to Greenspace!</h1>
        <div className="form">
          <a
            href="/auth/facebook"
            className="fb-btn btn"
            onClick={this.props.logInUser}
          >
            <img src="images/FB-f-Logo__white_1024.png" height="20px" className="fb-logo" />
            Log in with Facebook
          </a>
        </div>
      </PopUp>
    );
  }
}

LogIn.propTypes = {
  setMapViewOnly: PropTypes.func,
}

export default LogIn;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';

import PopUp from '../Components/PopUp.jsx';

class Homepage extends Component {
  constructor(props){
    super(props);
  }

  render(){
    let fbLogIn;
    if (!this.props.currentUser) {
      fbLogIn = (
        <a
          href="/auth/facebook"
          className="fb-btn btn"
          onClick={this.props.logInUser}
        >
          <img src="images/FB-f-Logo__white_1024.png" height="20px" className="fb-logo" />
          Log in with Facebook
        </a>
      );
    }

    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly}>
        <h1>Welcome to Greenspace!</h1>
        <div>
          <a href={`/loading/${window.location.search}`}>
            <div className="btn" id="explore-btn">Explore</div>
          </a>
          {fbLogIn}
        </div>
      </PopUp>
    );
  }
}

Homepage.propTypes = {
  setMapViewOnly: PropTypes.func,
};

export default Homepage;

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

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    // <div id='blurb'>
    //   Greenspace allows you to mark outdoor areas that other users can view.
    //    Plan events on these 'greenspaces' (add your friends!), write reviews,
    //    and find new natural areas around you to check out!
    // </div>
    let fbLogIn;
    if (!this.props.currentUser) {
      fbLogIn = (
        <a
          href="/auth/facebook"
          className="fb-btn btn"
        >
          <img src="images/FB-f-Logo__white_1024.png" height="20px" className="fb-logo" />
          Log in with Facebook
        </a>
      );
    }

    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly}>
        <h1>Welcome to Greenspace!</h1>
          <div id="tutorial-container">
            <img src="/images/small_create_greenspace.gif" className="tutorial-gif"></img>
            <img src="/images/small_create_event_4.gif" className="tutorial-gif"></img>
          </div>
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

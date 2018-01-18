import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';

import PopUp from '../Components/PopUp.jsx';

class Homepage extends Component {
  render(){
    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly}>
        <h1 className="section-header">Welcome to Greenspace!</h1>
        <div id="homepage-btns">
          <Link to="/map">
            <div className="btn">Explore</div>
          </Link>
          <Link to="/login">
            <div className="btn">Log In</div>
          </Link>
        </div>
      </PopUp>
    );
  }
}

Homepage.propTypes = {
  setMapViewOnly: PropTypes.func,
};

export default Homepage;

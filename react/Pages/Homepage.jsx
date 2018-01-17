import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import PopUp from '../Components/PopUp.jsx';

class Homepage extends Component {
  render(){
    return (
      <PopUp>
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

export default Homepage;

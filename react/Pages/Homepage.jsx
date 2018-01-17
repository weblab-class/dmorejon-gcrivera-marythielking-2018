import React, { Component } from 'react';
import PopUp from '../Components/PopUp.jsx';

class Homepage extends Component {
  render(){
    return (
      <PopUp>
        <h1 className="section-header">Welcome to Greenspace!</h1>
        <div id="homepage-btns">
          <div className="btn">Explore</div>
          <div className="btn">Log In</div>
        </div>
      </PopUp>
    );
  }
}

export default Homepage;

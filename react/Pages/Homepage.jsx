import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';

import PopUp from '../Components/PopUp.jsx';

class Homepage extends Component {
  constructor(props){
    super(props);

    this.state = {
      gifs: [
       "/images/small_create_greenspace.gif",
       "/images/small_create_event_4.gif"
      ],
      text: [
        "Create greenspaces by marking outdoor areas!",
        "Plan events on greenspaces and invite your friends!",
        "Personalize your discover page to find new natural areas around you!"
      ],
      currentGIF: 0,
    }

    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.goToGIF = this.goToGIF.bind(this);
  }

  goBack() {
    if (this.state.currentGIF === 0) {
      this.setState({ currentGIF: this.state.gifs.length - 1 });
    } else {
      this.setState({ currentGIF: this.state.currentGIF - 1 });
    }
  }

  goForward() {
    if (this.state.currentGIF === this.state.gifs.length - 1) {
      this.setState({ currentGIF: 0 });
    } else {
      this.setState({ currentGIF: this.state.currentGIF + 1 });
    }
  }

  goToGIF(e) {
    this.setState({ currentGIF: parseInt(e.target.id) });
  }

  render(){

    const {
      gifs,
      text,
      currentGIF,
    } = this.state;

    let imgs = [];
    let circles = [];
    for (let i = 0; i < gifs.length; i++) {
      if (i === currentGIF) {
        imgs.push(<img src={gifs[i]} key={i} className="tutorial-gif show"></img>);
        circles.push(
          <div className="circle-container" key={i} onClick={this.goToGIF}>
            <FontAwesome name="circle" id={i}/>
          </div>
        );
      } else {
        imgs.push(<img src={gifs[i]} key={i} className="tutorial-gif"></img>);
        circles.push(
          <div className="circle-container" key={i} onClick={this.goToGIF}>
            <FontAwesome name="circle-thin" id={i}/>
          </div>
        );
      }
    }

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
        <h1 style={{"marginBottom": "10px", "marginTop": "10px"}}>Welcome to Greenspace!</h1>
          <div id="tutorial-container">
            <div className="carousel-btn" id="carousel-back" onClick={this.goBack}>
              <FontAwesome
                name="angle-left"
                size="3x"
                title="Back"
              />
            </div>
            <div id="carousel-imgs">
              {imgs}
            </div>
            <div className="carousel-btn" id="carousel-forward" onClick={this.goForward}>
              <FontAwesome
                name="angle-right"
                size="3x"
                title="Forward"
              />
            </div>
          </div>
          <div id="circles-container">
            {circles}
          </div>
          <div>
            {text[currentGIF]}
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

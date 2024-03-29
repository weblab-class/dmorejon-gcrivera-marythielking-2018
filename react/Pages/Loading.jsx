import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../Components/PopUp.jsx';

class Loading extends Component {
  render(){
    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly} canClickOut={false}>
        <h1 className="section-header">finding your location...</h1>
        <div className="loading-img">
          <img src="/images/giphy.gif" height="250px"/>
        </div>
      </PopUp>
    );
  }
}

Loading.propTypes = {
  setMapViewOnly: PropTypes.func,
};

export default Loading;

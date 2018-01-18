import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../Components/PopUp.jsx';

class NotFound extends Component {
  render(){
    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly}>
        <h1>Page Not Found</h1>
      </PopUp>
    );
  }
}

NotFound.propTypes = {
  setMapViewOnly: PropTypes.func,
};

export default NotFound;

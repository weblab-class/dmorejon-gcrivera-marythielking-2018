import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../Components/PopUp.jsx';

class UserView extends Component {
  render(){
    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly}>
        <h1 className="section-header">UserView</h1>
      </PopUp>
    );
  }
}

UserView.propTypes = {
  setMapViewOnly: PropTypes.func,
};

export default UserView;

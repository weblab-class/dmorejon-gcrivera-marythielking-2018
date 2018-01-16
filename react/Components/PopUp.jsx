import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import onClickOutside from 'react-onclickoutside';

class PopUp extends Component {
  handleClickOutside(event) {
    this.props.router.push(`/map`);
  }

  render(){
    return (
      <div id="popup">
        {this.props.children}
      </div>
    )
  }
}

PopUp.propTypes = {
  children : PropTypes.any.isRequired
};

export default withRouter(onClickOutside(PopUp));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import onClickOutside from 'react-onclickoutside';

class Sidebar extends Component {
  handleClickOutside(event) {
    this.props.router.push(`/map`);
  }

  render(){
    return (
      <div id="sidebar">
        {this.props.children}
      </div>
    )
  }
}

Sidebar.propTypes = {
  children : PropTypes.any.isRequired
};

export default withRouter(onClickOutside(Sidebar));

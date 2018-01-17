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
      <div className="sidebar" id={this.props.id}>
        {this.props.children}
      </div>
    )
  }
}

Sidebar.propTypes = {
  children : PropTypes.any.isRequired,
  id : PropTypes.string,
};

export default withRouter(onClickOutside(Sidebar));

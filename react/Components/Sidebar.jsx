import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Sidebar extends Component {
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

export default Sidebar;

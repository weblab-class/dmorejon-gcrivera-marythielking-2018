import React, { Component } from 'react';

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
  children : React.PropTypes.any.isRequired
};

export default Sidebar;

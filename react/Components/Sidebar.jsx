import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import onClickOutside from 'react-onclickoutside';

class Sidebar extends Component {
  componentDidMount() {
    // console.log('sidebar did mount');
    this.props.setMapPlaceMarkers(false);
  }

  componentWillUnmount() {
    // console.log('sidebar will unmount');
    this.props.setMapPlaceMarkers(true);
  }

  handleClickOutside(event) {
    if (this.props.clickOut) {
      this.props.router.push(`/map/${window.location.search}`);
    }
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
  children: PropTypes.any.isRequired,
  id: PropTypes.string,
  clickOut: PropTypes.bool,
  setMapPlaceMarkers: PropTypes.func,
};

Sidebar.defaultProps = {
  clickOut: true,
}

export default withRouter(onClickOutside(Sidebar));

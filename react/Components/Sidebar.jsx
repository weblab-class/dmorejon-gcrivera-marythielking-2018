import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import onClickOutside from 'react-onclickoutside';
import FontAwesome from 'react-fontawesome';

class Sidebar extends Component {
  componentDidMount() {
    this.props.setMapPlaceMarkers(false);
  }

  componentWillUnmount() {
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
        <Link to={`/map/${window.location.search}`} className="close-btn" id="sidebar-close-btn">
          <FontAwesome name="times" size="lg" title="Close"/>
        </Link>
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

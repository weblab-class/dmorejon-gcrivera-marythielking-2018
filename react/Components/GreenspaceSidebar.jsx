import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';

import Sidebar from '../Components/Sidebar.jsx';

class GreenspaceSidebar extends Component {

  render(){
    const {
      setMapPlaceMarkers,
      name,
      lat,
      lng,
      backTo,
      children,
    } = this.props;


    let backButton = null;
    if (backTo !== '') {
      backButton = (
        <Link to={backTo} id="back-button">
          <FontAwesome name="angle-left" size="2x" id="back-button-icon" />
        </Link>
      );
    }

    return (
      <Sidebar setMapPlaceMarkers={setMapPlaceMarkers}>
        { backButton }
        <div id="greenspace-header">
          <h1>{name}</h1>
          <a href={`https://www.google.com/maps?saddr=My+Location&daddr=${lat},${lng}`} target="_blank">
            <img src="/images/google-maps-icon-2015.png" height="30px" className="gmaps-logo" />
          </a>
        </div>
        { children }
      </Sidebar>
    );
  }
}

GreenspaceSidebar.propTypes = {
  children: PropTypes.any,
  setMapPlaceMarkers: PropTypes.func,
  name: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  backTo: PropTypes.string,
}

GreenspaceSidebar.defaultProps = {
  backTo: '',
}

export default withRouter(GreenspaceSidebar);

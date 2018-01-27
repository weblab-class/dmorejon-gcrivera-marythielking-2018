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
      backButton,
      children,
      router,
      isFavorite,
    } = this.props;

    let renderedBackButton = null;
    if (backButton) {
      renderedBackButton = (
        <FontAwesome
          name="angle-left"
          size="2x"
          id="back-button"
          title="Back"
          onClick={router.goBack}
        />
      );
    }

    let renderedStar = <FontAwesome
      name="star"
      size="lg"
      id="fav-star-filled"
      title="Favorite"
    />;
    if (isFavorite) {
      renderedStar = (
        <FontAwesome
          name="star"
          size="lg"
          id="fav-star-filled"
          title="Favorite"
        />
      );
    }


    return (
      <Sidebar setMapPlaceMarkers={setMapPlaceMarkers}>
        { renderedBackButton }
        <div id="greenspace-header">
          <div id="greenspace-name-star">
            <h1>{name}</h1>
            {renderedStar}
          </div>

          <a href={`https://www.google.com/maps?saddr=My+Location&daddr=${lat},${lng}`} target="_blank">
            <img src="/images/google-maps-icon-2015.png" height="30px" className="gmaps-logo" title="Directions"/>
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
  backButton: PropTypes.bool,
  isFavorite: PropTypes.bool,
}

GreenspaceSidebar.defaultProps = {
  backButton: true,
}

export default withRouter(GreenspaceSidebar);

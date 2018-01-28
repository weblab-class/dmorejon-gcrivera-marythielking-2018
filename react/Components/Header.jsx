import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Services from '../../services';

class Header extends Component {
  render(){
    const { currentUser } = this.props;
    let headerButtons = null;

    if (currentUser) {
      const { displayname, photo } = currentUser;
      headerButtons = (<div id="header-btns">
        <Link to={`/map/${window.location.search}`}>
          <div className="header-btn">
            <FontAwesome name="map-o" size="2x" title="To Map"/>
          </div>
        </Link>
        <Link to={`/user/view/${currentUser.fbid}/${window.location.search}`}>
          <div className="header-btn">
              <img src={photo} height="40px" className="profile-icon" id="header-profile-icon" title="User Profile"/>
          </div>
        </Link>
        <a href="/logout">
          <div className="header-btn">
            <FontAwesome name="sign-out" size="2x" title="Logout"/>
          </div>
        </a>
      </div>);
    } else {
      headerButtons = (<Link to="/login">
        <div className="header-btn">
          <FontAwesome name="sign-in" size="2x" title="Log in"/>
        </div>
      </Link>);
    }

    return (
      <div id="header">
        <Link to={`/${window.location.search}`}><div id="header-logo">greenspace</div></Link>
        {headerButtons}
      </div>
    )
  }
}

Header.propTypes = {
  currentUser: PropTypes.object,
}

export default withRouter(Header);

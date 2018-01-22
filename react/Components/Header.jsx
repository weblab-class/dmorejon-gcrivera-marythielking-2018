import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Services from '../../services';

class Header extends Component {
  render(){
    const {
      currentUser,
      userPhoto,
    } = this.props;
    let headerButtons = null;

    if (currentUser) {
      headerButtons = (<div id="header-btns">
        <div className="header-btn-content">Welcome, {currentUser}</div>
        <Link to={`/user/${currentUser}/${window.location.search}`}>
          <div className="header-btn">
              <img src={userPhoto} height="40px" className="profile-icon"/>
          </div>
        </Link>
        <a href="/logout">
          <div className="header-btn">
            <FontAwesome name="sign-out" size="2x" />
          </div>
        </a>
      </div>);
    } else {
      headerButtons = (<Link to="/login">
        <div className="header-btn">
          <FontAwesome name="sign-in" size="2x" />
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
  currentUser: PropTypes.string,
}

export default withRouter(Header);

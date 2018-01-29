import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Services from '../../services';

class Header extends Component {
  constructor(props){
    super(props);

    this.headerClick = this.headerClick.bind(this);
  }

  headerClick(path) {
    if (!this.props.location.pathname.startsWith('/loading')) {
      this.props.router.push(path);
    }
  }

  render(){
    const { currentUser } = this.props;
    let headerButtons = null;

    let signoutBtn = (
      <div className="freeze-header-btn">
        <FontAwesome name="sign-out" size="2x" title="Logout"/>
      </div>
    );
    let btnClass = "freeze-header-btn";
    let headerClass;
    if (!this.props.location.pathname.startsWith('/loading')) {
      signoutBtn = (
        <a href="/logout">
          <div className="header-btn">
            <FontAwesome name="sign-out" size="2x" title="Logout"/>
          </div>
        </a>
      );
      btnClass = "header-btn";
      headerClass = "logo-hover"
    }

    if (currentUser) {
      const { displayname, photo } = currentUser;
      headerButtons = (<div id="header-btns">
        <div className={btnClass} onClick={() => this.headerClick(`/map/${window.location.search}`)}>
          <FontAwesome name="map-o" size="2x" title="To Map"/>
        </div>
        <div className={btnClass} onClick={() => this.headerClick(`/user/view/${currentUser.fbid}/${window.location.search}`)}>
            <img src={photo} height="40px" className="profile-icon" id="header-profile-icon" title="User Profile"/>
        </div>
        {signoutBtn}
      </div>);
    } else {
      headerButtons = (
        <div className={btnClass} onClick={() => this.headerClick(`/login`)}>
          <div className="header-btn-text">Login</div>
          <FontAwesome name="sign-in" size="2x" title="Log in"/>
        </div>
      );
    }

    return (
      <div id="header">
        <div id="header-logo" className={headerClass} onClick={() => this.headerClick(`/${window.location.search}`)}>
          <img src="/images/logo_name.png" height="50px" className="header-logo" id="logo-words" />
          <img src="/images/logo_icon.png" height="50px" className="header-logo" id="logo-icon" />
        </div>
        {headerButtons}
      </div>
    )
  }
}

Header.propTypes = {
  currentUser: PropTypes.object,
}

export default withRouter(Header);

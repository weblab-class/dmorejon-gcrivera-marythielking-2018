import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';

class Header extends Component {
  render(){
    const {
      currentUser,
      logOutUser,
    } = this.props;

    var headerButtons = null;
    if (currentUser) {
      headerButtons = (<div id="header-btns">
        <div className="header-btn-content">Welcome, {currentUser}</div>
        <Link to={`/user/${currentUser}`}>
          <div className="header-btn">
            <FontAwesome name="user" size="2x" />
          </div>
        </Link>
        <Link to="/">
          <div className="header-btn" onClick={logOutUser}>
            <FontAwesome name="sign-out" size="2x" />
          </div>
        </Link>
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
        <Link to="/"><div id="header-logo">greenspace</div></Link>
        {headerButtons}
      </div>
    )
  }
}

Header.propTypes = {
  currentUser: PropTypes.string,
  logOutUser: PropTypes.func,
}

export default withRouter(Header);

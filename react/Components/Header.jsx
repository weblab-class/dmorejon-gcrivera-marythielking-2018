import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Services from '../../services';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {currentUser: '', photo: ''};

    let {
      currentUser,
      logOutUser,
    } = this.props;

    Services.user.info()
      .then((res) => {
        if (res.content) {
          this.setState({ currentUser: res.content.displayname , photo: res.content.photo});
        }
      });
  }

  render(){
    let {
      currentUser,
      logOutUser,
    } = this.props;

    currentUser = this.state.currentUser;
    const photo = this.state.photo;
    let headerButtons = null;

    if (currentUser) {
      headerButtons = (<div id="header-btns">
        <div className="header-btn-content">Welcome, {currentUser}</div>
        <Link to={`/user/${currentUser}/${window.location.search}`}>
          <div className="header-btn">
              <img src={photo} height="40px" className="profile-icon"/>
          </div>
        </Link>
        <a href="/logout">
          <div className="header-btn" onClick={logOutUser}>
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
  logOutUser: PropTypes.func,
}

export default withRouter(Header);

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';

class Header extends Component {
  render(){
    return (
      <div id="header">
        <Link to="/"><div id="header-logo">greenspace</div></Link>
        <Link to="/login">
          <div className="header-btn">
              <FontAwesome name="sign-in" size="2x" />
          </div>
        </Link>
      </div>
    )
  }
}

export default withRouter(Header);

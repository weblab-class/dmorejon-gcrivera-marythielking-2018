import React, { Component } from 'react';

export default class Header extends Component {
    render(){
      return (
        <div id="header">
          <div id="header-logo">greenspace</div>
          <div id="header-btns">
            <div className="header-btn">
              <div className="header-btn-content">Map</div>
            </div>
            <div className="header-btn">
              <div className="header-btn-content">User</div>
            </div>
          </div>
        </div>
      )
    }
}

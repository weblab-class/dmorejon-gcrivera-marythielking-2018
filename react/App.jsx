import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Header from './Components/Header.jsx';
import LeafletMap from './Components/LeafletMap.jsx';
import Sidebar from './Components/Sidebar.jsx';
import PopUp from './Components/PopUp.jsx';

class App extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
  };

  render(){
    return (
      <div>
        <Header />
        <div id="content">
          <LeafletMap />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withRouter(App);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Header from './Components/Header.jsx';
import LeafletMap from './Components/LeafletMap.jsx';

class App extends Component {
  render(){
    return (
      <div>
        <Header />
        <div id="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.any.isRequired,
}

export default withRouter(App);

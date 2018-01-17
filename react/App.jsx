import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Header from './Components/Header.jsx';
import LeafletMap from './Components/LeafletMap.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      showMap: true,
      currentUser: null,
    };

    this.loginUser = this.loginUser.bind(this);
  }

  loginUser(username, email) {
    this.setState({ currentUser: username });
    this.props.router.push(`/map`);
  }

  createGreenspace(name, lat, lng) {
    console.log(`greenspace ${name} created at ${lat}, ${lng}`);
    this.props.router.push(`/map`);
  }

  render(){
    const {
      showMap,
      currentUser,
    } = this.state;

    return (
      <div>
        <Header currentUser={currentUser} />
        <div id="content">
          <LeafletMap
            display={showMap}
          />
          {React.cloneElement(this.props.children, {
            loginUser: this.loginUser,
            createGreenspace: this.createGreenspace,
          })}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.any,
}

export default withRouter(App);

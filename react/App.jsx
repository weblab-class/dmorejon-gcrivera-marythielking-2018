import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Header from './Components/Header.jsx';
import LeafletMap from './Components/LeafletMap.jsx';
import Sidebar from './Components/Sidebar.jsx';
import PopUp from './Components/PopUp.jsx';

class App extends Component {
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

App.propTypes = {
  children : React.PropTypes.any.isRequired
};

export default withRouter(App);

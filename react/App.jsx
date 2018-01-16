import React, { Component } from 'react';
import Header from './Components/Header.jsx';
import LeafletMap from './Components/LeafletMap.jsx'
import Sidebar from './Components/Sidebar.jsx'

export default class App extends Component {
    render(){
      return (
        <div>
          <Header />
          <div id="content">
            <LeafletMap />
            <Sidebar />
          </div>
        </div>
      );
    }
}

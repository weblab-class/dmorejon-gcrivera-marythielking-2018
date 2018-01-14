import React, { Component } from 'react';
import Header from './Header.jsx';
import LeafletMap from './LeafletMap.jsx'

export default class App extends Component {
    render(){
      return (
        <div>
          <Header />
          <LeafletMap />
        </div>
      );
    }
}

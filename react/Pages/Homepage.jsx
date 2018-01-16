import React, { Component } from 'react';
import LeafletMap from '../Components/LeafletMap.jsx';
import PopUp from '../Components/PopUp.jsx';

export default class Homepage extends Component {
    render(){
      return (
        <div>
          <LeafletMap />
          <PopUp>Homepage</PopUp>
        </div>
      );
    }
}

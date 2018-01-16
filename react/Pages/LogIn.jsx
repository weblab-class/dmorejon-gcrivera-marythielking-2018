import React, { Component } from 'react';
import LeafletMap from '../Components/LeafletMap.jsx';
import PopUp from '../Components/PopUp.jsx';

export default class LogIn extends Component {
    render(){
      return (
        <div>
          <LeafletMap />
          <PopUp>LogIn</PopUp>
        </div>
      );
    }
}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class LeafletMap extends Component {

  componentDidMount() {
    var map = this.map = L.map(ReactDOM.findDOMNode(this), {
      center: [42.3601, -71.0942],
      zoom: 16,
      layers: [
        L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
      ],
      attributionControl: false,
    });
  }

  componentWillUnmount() {
    this.map = null;
  }

  render(){
    return (
      <div id="leaflet-map"></div>
    );
  }
}

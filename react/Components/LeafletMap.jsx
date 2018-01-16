import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class LeafletMap extends Component {

  componentDidMount() {
    var map = this.map = L.map(ReactDOM.findDOMNode(this), {
      center: [42.3601, -71.0942],
      zoom: 16,
      minZoom: 2,
    });
    var layer = new L.StamenTileLayer("terrain");
    map.addLayer(layer);
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

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class LeafletMap extends Component {
  constructor(props){
    super(props);
    this.onMapClick = this.onMapClick.bind(this);
  }

  componentDidMount() {
    var map = this.map = L.map(ReactDOM.findDOMNode(this), {
      center: [42.3601, -71.0942],
      zoom: 16,
      minZoom: 2,
    });
    var layer = new L.StamenTileLayer("terrain");
    map.addLayer(layer);
    map.on('click', this.onMapClick)
  }

  componentWillUnmount() {
    this.map = null;
  }

  onMapClick(event) {
    console.log(event);
    var marker = L.marker(event.latlng).addTo(this.map);
  }

  render(){
    return (
      <div id="leaflet-map"></div>
    );
  }
}

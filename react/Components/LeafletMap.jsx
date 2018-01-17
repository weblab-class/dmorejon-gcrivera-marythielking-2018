import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class LeafletMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      marker: null,
    }
    this.onMapClick = this.onMapClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  componentDidMount() {
    var map = this.map = L.map(ReactDOM.findDOMNode(this), {
      center: [42.3580, -71.0942],
      zoom: 16,
      minZoom: 2,
    });
    var layer = new L.StamenTileLayer("terrain");
    map.addLayer(layer);
    map.on('click', this.onMapClick)

    // dummy marker pre-backend
    const newMarker = L.marker([42.35665702548128, -71.1]).addTo(map);
    newMarker.on('click', this.onMarkerClick);
  }

  componentWillUnmount() {
    this.map = null;
  }

  onMapClick(event) {
    const {
      marker
    } = this.state;

    if (!marker) {
      const newMarker = L.marker(event.latlng).addTo(this.map);
      newMarker.on('click', this.onMarkerClick);
      this.setState({ marker: newMarker });
    } else {
      marker.remove(this.map);
      this.setState({ marker: null });
    }
  }

  onMarkerClick(event) {
    const {
      marker
    } = this.state;

    const { lat: e_lat, lng: e_lng } = event.latlng;
    if (marker) {
      const { lat: m_lat, lng: m_lng } = marker.getLatLng();
      if (e_lat === m_lat && e_lng === m_lng) {
        this.props.router.push(`/map/${e_lat},${e_lng}/create`);
      } else {
        marker.remove(this.map);
        this.setState({ marker: null });
        this.props.router.push(`/map/${e_lat},${e_lng}`);
      }
    } else {
      this.props.router.push(`/map/${e_lat},${e_lng}`);
    }
  }

  render(){
    return (
      <div id="leaflet-map" className={this.props.display ? '' : 'hidden'}></div>
    );
  }
}

LeafletMap.propTypes = {
  display: PropTypes.bool,
}

LeafletMap.defaultProps = {
  display: true,
}

export default withRouter(LeafletMap);

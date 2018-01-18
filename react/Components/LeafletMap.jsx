import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import greenspaceServices from '../../services/greenspaceServices.js';

class LeafletMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      marker: null,
      placeMarkers: true,
    }

    this.setMarkers = this.setMarkers.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.setMapCenter = this.setMapCenter.bind(this);
  }

  componentDidMount() {
    var map = this.map = L.map(ReactDOM.findDOMNode(this), {
      center: [42.3580, -71.0942],
      zoom: 16,
      minZoom: 2,
      zoomControl: false,
    });
    var layer = new L.StamenTileLayer("terrain");
    map.addLayer(layer);
    var zoomControl = this.zoomControl = new L.control.zoom({ position: 'bottomleft' }).addTo(map);
    map.on('click', this.onMapClick)
    map.on('moveend', this.setMarkers);

    this.setMarkers();
    this.setMapCenter(this.map);

    if (this.props.viewOnly) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (map.tap) { map.tap.disable(); }
      // map.zoomControl = false;
      this.zoomControl.remove();

      this.setState({ placeMarkers: false });
    }

    // dummy marker pre-backend
    const newMarker = L.marker([42.35665702548128, -71.1]).addTo(map);
    newMarker.on('click', this.onMarkerClick);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.viewOnly !== this.props.viewOnly) {
      if (newProps.viewOnly) {
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();
        if (this.map.tap) { this.map.tap.disable(); }
        this.zoomControl.remove();

        this.setState({ placeMarkers: false });
      } else {
        this.map.dragging.enable();
        this.map.touchZoom.enable();
        this.map.doubleClickZoom.enable();
        this.map.scrollWheelZoom.enable();
        this.map.boxZoom.enable();
        this.map.keyboard.enable();
        if (this.map.tap) { this.map.tap.enable() }
        this.zoomControl.addTo(this.map);
      }
    }
  }

  componentWillUnmount() {
    this.map = null;
  }

  setMarkers() {
    const bounds = this.map.getBounds();
    const swBounds = bounds.getSouthWest();
    const neBounds = bounds.getNorthEast();

    const minLat = Math.min(swBounds.lat, neBounds.lat);
    const maxLat = Math.max(swBounds.lat, neBounds.lat);
    const minLng = Math.min(swBounds.lng, neBounds.lng);
    const maxLng = Math.max(swBounds.lng, neBounds.lng);

    greenspaceServices.getAll(minLat, maxLat, minLng, maxLng)
      .then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
  }

  onMapClick(event) {
    const {
      marker,
      placeMarkers,
    } = this.state;

    if (this.props.viewOnly) { return; }
    if (!placeMarkers) {
      this.setState({ placeMarkers: true });
      return;
    }

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
    if (this.props.viewOnly) { return; }
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

  setMapCenter(map) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        map.setView([position.coords.latitude, position.coords.longitude])
      });
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
  viewOnly: PropTypes.bool,
}

LeafletMap.defaultProps = {
  display: true,
  viewOnly: false,
}

export default withRouter(LeafletMap);

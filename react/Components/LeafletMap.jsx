import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import greenspaceServices from '../../services/greenspaceServices.js';

class LeafletMap extends Component {
  constructor(props){
    super(props);

    if (window.location.search) {
      var center = window.location.search.split('=')[1].split(',');
      center = [parseFloat(center[0]), parseFloat(center[1])];
    } else {
      var center = [42.308604, -71.096353]; //[42.3580, -71.0942],
    }

    this.state = {
      marker: null,
      placeMarkers: true,
      center: center,
    }

    this.disableMap = this.disableMap.bind(this);
    this.enableMap = this.enableMap.bind(this);
    this.placeMarker = this.placeMarker.bind(this);
    this.setMarkers = this.setMarkers.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.setMapCenter = this.setMapCenter.bind(this);
  }

  componentDidMount() {
    var map = this.map = L.map(ReactDOM.findDOMNode(this), {
      center: this.state.center,
      zoom: 16,
      minZoom: 2,
      zoomControl: false,
    });
    var Hydda_Full = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
    	maxZoom: 18,
    	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    map.addLayer(Hydda_Full);
    var zoomControl = this.zoomControl = new L.control.zoom({ position: 'bottomleft' }).addTo(map);
    map.on('click', this.onMapClick)
    map.on('moveend', this.setMarkers);

    this.setMarkers();
    this.setMapCenter(this.map);

    if (this.props.viewOnly) { this.disableMap(); }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.viewOnly !== this.props.viewOnly) {
      if (newProps.viewOnly) { this.disableMap(); }
      else { this.enableMap(); }
    }
  }

  componentWillUnmount() {
    this.map = null;
  }

  disableMap() {
    this.map.dragging.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    if (this.map.tap) { this.map.tap.disable(); }
    this.zoomControl.remove();
    this.setState({ placeMarkers: false });
  }

  enableMap() {
    this.map.dragging.enable();
    this.map.touchZoom.enable();
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
    this.map.boxZoom.enable();
    this.map.keyboard.enable();
    if (this.map.tap) { this.map.tap.enable() }
    this.zoomControl.addTo(this.map);
  }

  placeMarker(latlng, id="temp") {
    const marker = L.marker(latlng).addTo(this.map);
    marker.on('click', this.onMarkerClick);
    marker.gid = id;
    return marker;
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
        res.content.map((g) => this.placeMarker(g.location, g._id));
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
      const newMarker = this.placeMarker(event.latlng);
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
        this.props.router.push(`/map/${e_lat},${e_lng}/create/${window.location.search}`);
      } else {
        marker.remove(this.map);
        this.setState({ marker: null });
        this.props.router.push(`/map/${event.target.gid}/${window.location.search}`);
      }
    } else {
      this.props.router.push(`/map/${event.target.gid}/${window.location.search}`);
    }
  }

  setMapCenter(map) {
    if (window.location.search) {
      var center = window.location.search.split('=')[1].split(',');
      map.setView([parseFloat(center[0]), parseFloat(center[1])]);
      this.props.router.push(`/map/?loc=${this.state.center[0]},${this.state.center[1]}`);
      return;
    }
    if (navigator.geolocation && this.props.location.pathname.startsWith('/loading')) {
      navigator.geolocation.getCurrentPosition((position) => {
        // map.setView([position.coords.latitude, position.coords.longitude]);
        this.setState({ center: [position.coords.latitude, position.coords.longitude] });
        map.setView(this.state.center);
        this.props.router.push(`/map/?loc=${this.state.center[0]},${this.state.center[1]}`);
        return;
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

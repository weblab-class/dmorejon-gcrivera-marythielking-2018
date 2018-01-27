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
      var center = [42.3580, -71.0942];
    }

    this.state = {
      marker: null,
      placeMarkers: props.placeMarkers,
      prevPlaceMarkers: true,
      center: center,
      icon: null,
    }

    this.disableMap = this.disableMap.bind(this);
    this.enableMap = this.enableMap.bind(this);
    this.placeMarker = this.placeMarker.bind(this);
    this.setMarkers = this.setMarkers.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onNewMarker = this.onNewMarker.bind(this);
    this.setMapCenter = this.setMapCenter.bind(this);
    this.placeNewMarker = this.placeNewMarker.bind(this);
    this.recenter = this.recenter.bind(this);
  }

  componentDidMount() {
    let zoom = 16;
    var map = this.map = L.map(ReactDOM.findDOMNode(this), {
      center: this.state.center,
      zoom: zoom,
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
    if(this.props.location.pathname === '/loading') {
      this.disableMap()
      this.map.off('click');
      this.setState({
        placeMarkers: true,
        prevPlaceMarkers: true,
      });
    }
    else {
      this.enableMap();
      this.map.on('click', this.onMapClick);
    }

    if (newProps.resetMarkers && this.state.marker) {
      this.state.marker.remove(this.map);
      this.setState({ marker: null });
    }

    if (newProps.viewOnly !== this.props.viewOnly) {
      if (newProps.viewOnly) { this.disableMap(); }
      else { this.enableMap(); }
    }

    if (newProps.newMarker) {
      this.setMarkers();
    }

    if (newProps.placeMarkers !== this.state.placeMarkers) {
      this.setState({
        placeMarkers: newProps.placeMarkers,
        prevPlaceMarkers: this.state.placeMarkers,
      });
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
    marker.on('click', this.onNewMarker);
    marker.gid = id;
    return marker;
  }

  placeNewMarker(latlng, id="temp") {
    if (!this.props.currentUser) {
      return;
    }
    const marker = L.marker(latlng).addTo(this.map);
    this.setState({ marker: marker });
    this.onNewMarker({latlng: latlng, target: {gid: marker.gid}});
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
        res.content.map((g) => this.placeMarker(g.location.coordinates, g._id));
      }).catch((err) => {
        console.log(err);
      });
  }

  onMapClick(event) {
    const {
      marker,
      placeMarkers,
      prevPlaceMarkers,
    } = this.state;

    if (!placeMarkers) {
      this.setState({ placeMarkers: true });
      return;
    } else if (prevPlaceMarkers === false) {
      if (marker) {
        marker.remove(this.map);
        this.setState({ marker: null });
      }
      this.setState({ prevPlaceMarkers: true });
      return;
    }

    if (!marker) {
      const newMarker = this.placeNewMarker(event.latlng);
    } else {
      marker.remove(this.map);
      this.setState({ marker: null });
    }
  }

  onNewMarker(event) {
    if (this.props.viewOnly) { return; }
    const {
      marker
    } = this.state;

    const { lat: e_lat, lng: e_lng } = event.latlng;
    if (marker) {
      const { lat: m_lat, lng: m_lng } = marker.getLatLng();
      if (e_lat === m_lat && e_lng === m_lng) {
        if (this.props.currentUser){
          this.props.router.push(`/map/${e_lat},${e_lng}/create/${window.location.search}`);
        }
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
    var locIcon = L.icon({
      iconUrl: '/images/pulse_dot.gif',
      iconSize: [20, 20]
    });
    if (window.location.search) {
      var center = window.location.search.split('=')[1].split(',');
      map.setView([parseFloat(center[0]), parseFloat(center[1])]);
      this.props.router.push(`/map/?loc=${this.state.center[0]},${this.state.center[1]}`);
      L.marker(this.state.center, {icon: locIcon}).addTo(map);
      this.setState({ icon: locIcon });
      return;
    }
    if (navigator.geolocation && this.props.location.pathname.startsWith('/loading')) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ center: [position.coords.latitude, position.coords.longitude] });
        map.setView(this.state.center);
        this.props.router.push(`/map/?loc=${this.state.center[0]},${this.state.center[1]}`);
        L.marker(this.state.center, {icon: locIcon}).addTo(map);
        this.setState({ icon: locIcon });
        return;
      });
    }
  }

  recenter() {
    this.map.setView(this.state.center);
    this.map.setZoom(16);
  }

  render(){
    return (
      <div id="leaflet-map" className={this.props.display ? '' : 'hidden'}>
        <div className="leaflet-bottom leaflet-left">
          <div className="leaflet-control-zoom leaflet-bar leaflet-control find-loc-div leaflet-touch"
                onClick={this.recenter}>
            <img src="/images/location-512.png" id="find-loc-btn"/>
          </div>
        </div>
      </div>
    );
  }
}

LeafletMap.propTypes = {
  display: PropTypes.bool,
  viewOnly: PropTypes.bool,
  placeMarkers: PropTypes.bool,
  currentUser: PropTypes.object,
}

LeafletMap.defaultProps = {
  display: true,
  viewOnly: false,
  placeMarkers: true,
}

export default withRouter(LeafletMap);

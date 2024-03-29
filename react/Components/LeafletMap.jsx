import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import omitBy from 'lodash/omitBy';
import has from 'lodash/has';
import Cluster from 'leaflet.markercluster';
import greenspaceServices from '../../services/greenspaceServices.js';

class LeafletMap extends Component {
  constructor(props){
    super(props);

    var center = null;
    if (window.location.search) {
      center = window.location.search.split('=')[1].split(',');
      center = [parseFloat(center[0]), parseFloat(center[1])];
    } else {
      center = [42.3580, -71.0942];
    }

    this.state = {
      marker: null,
      placeMarkers: props.placeMarkers,
      prevPlaceMarkers: true,
      center: center,
      icon: null,
      currentGreenspace: null,
      cluster: new Cluster.MarkerClusterGroup({ showCoverageOnHover: true}),
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
    this.discoverClick = this.discoverClick.bind(this);
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

    this.setMapCenter(this.map);
    this.setMarkers();

    if (this.props.viewOnly) { this.disableMap(); }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.setMapView) {
      const propsDiff = omitBy(newProps, (v,k) => { return (this.props[k] === v); });
      const hasSetMapView = has(propsDiff, 'setMapView');
      if (hasSetMapView) {
        this.setState({ currentGreenspace: newProps.setMapView });
        this.map.setView(newProps.setMapView);
      }
    }

    if (this.props.location.pathname === '/loading') {
      this.disableMap()
      this.map.off('click');
      this.setState({
        placeMarkers: true,
        prevPlaceMarkers: true,
      });
    } else {
      this.enableMap();
      this.map.on('click', this.onMapClick);
    }

    if (newProps.resetMarkers && this.state.marker) {
      this.state.marker.remove(this.map);
      this.setState({ marker: null , cluster: markers });
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
    if (this.state.currentGreenspace) {
      if (this.state.currentGreenspace[0] == latlng[0] && this.state.currentGreenspace[1] == latlng[1]) {
        const icon = L.icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        const marker = L.marker(latlng, {icon: icon})
        marker.on('click', this.onNewMarker);
        marker.gid = id;
        return marker;
      }
    }
    const marker = L.marker(latlng)
    marker.on('click', this.onNewMarker);
    marker.gid = id;
    return marker;
  }

  placeNewMarker(latlng, id="temp") {
    const icon = L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    const marker = L.marker(latlng, {icon: icon}).addTo(this.map);
    this.setState({ marker: marker });
    this.onNewMarker({latlng: latlng, target: {gid: marker.gid}});
    marker.gid = id;
    return marker;
  }

  setMarkers() {
    let markers = this.state.cluster;
    markers.clearLayers();

    const bounds = this.map.getBounds();
    const swBounds = bounds.getSouthWest();
    const neBounds = bounds.getNorthEast();

    const minLat = Math.min(swBounds.lat, neBounds.lat);
    const maxLat = Math.max(swBounds.lat, neBounds.lat);
    const minLng = Math.min(swBounds.lng, neBounds.lng);
    const maxLng = Math.max(swBounds.lng, neBounds.lng);

    greenspaceServices.getAll(minLat, maxLat, minLng, maxLng)
      .then((res) => {
        res.content.map((g) => {
          const allMarkers = markers.getLayers()
          const duplicate = allMarkers.some((layer) => {
            return g._id == layer.gid;
          });
          if (!duplicate) {
            const marker = this.placeMarker(g.location, g._id);
            markers.addLayer(marker);
          }
        });
        this.map.addLayer(markers);
        this.setState({ cluster: markers });
      }).catch((err) => {
        console.log(err);
      });
  }

  onMapClick(event) {
    if (this.props.location.pathname == ('/map/')) {
      this.setState({ currentGreenspace: null }, () => this.setMarkers());
    }

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
        } else {
          this.props.router.push(`/map/${e_lat},${e_lng}/create/login/${window.location.search}`);
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
      L.marker(this.state.center, {icon: locIcon, zIndexOffset: -300}).addTo(map);
      this.setState({ icon: locIcon });
      return;
    }
    if (this.props.location.pathname.startsWith('/loading')) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({ center: [position.coords.latitude, position.coords.longitude] });
          map.setView(this.state.center);
          this.props.router.push(`/map/?loc=${this.state.center[0]},${this.state.center[1]}`);
          L.marker(this.state.center, {icon: locIcon, zIndexOffset: -300}).addTo(map);
          this.setState({ icon: locIcon });
          return;
        }, (err) => {
          this.props.router.push(`/map`);
          return;
        });
      } else {
        this.props.router.push(`/map`);
      }
    }
  }

  recenter() {
    this.map.setView(this.state.center);
    this.map.setZoom(16);
    if (this.state.marker) {
      this.state.marker.remove(this.map);
      this.setState({ marker: null });
      this.props.router.push(`/map/?loc=${this.state.center[0]},${this.state.center[1]}`);
    }
  }

  discoverClick() {
    if (this.state.marker) {
      this.state.marker.remove(this.map);
      this.setState({ marker: null });
    }
    this.props.router.push(`/discover/${window.location.search}`);
    return;
  }

  render(){
    let imgClass;
    if (this.props.viewOnly) {imgClass = 'hidden'}

    let discover;
    if(this.props.currentUser) {
      discover = (
        <div className="leaflet-control-zoom leaflet-bar leaflet-control leaflet-touch discover-div"
              onClick={this.discoverClick}>
          <FontAwesome name="search" size="3x" title="Discover" id="discover-icon"/>
        </div>
      );
    }

    return (
      <div id="leaflet-map" className={this.props.display ? '' : 'hidden'}>
        <div className="leaflet-bottom leaflet-left">
          <div className="leaflet-control-zoom leaflet-bar leaflet-control find-loc-div leaflet-touch"
                onClick={this.recenter}>
            <img src="/images/location-512.png" id="find-loc-btn" className={imgClass}/>
          </div>
        </div>
        <div className={`leaflet-top leaflet-left ${imgClass}`}>
          {discover}
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

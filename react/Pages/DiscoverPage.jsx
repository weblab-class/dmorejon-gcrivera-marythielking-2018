import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';

import Services from '../../services';
import Sidebar from '../Components/Sidebar.jsx';
import EventList from '../Components/EventList.jsx';

class Discover extends Component {
  constructor(props){
    super(props);

    this.state = {
      data: null,
      location: null,
    };

    this.renderData = this.renderData.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
  }

  componentDidMount() {
    if (window.location.search) {
      let location = window.location.search.split('=')[1].split(',');
      location = [parseFloat(location[0]), parseFloat(location[1])];
      this.setState({location: location});
      Services.discover.info(location)
        .then((res) => {
          if (this.refs.component) {
            this.setState({data: res.content});
          }
        });
    }
  }

  renderEvents(events) {
    if (events.length === 0) {
      return (<div id="discover-upcoming-events">There are no upcoming events.</div>);
    }
    return (<div id="discover-upcoming-events">
      <EventList events={events} maxHeight="80px" />
    </div>);
  }

  renderData(data) {
    return data.map((val) => {
      const events = this.renderEvents(val.events);
      return (
        <div key={val.greenspace._id} className="discover-greenspace">
          <div className="discover-greenspace-header">
            <div className="discover-greenspace-name">{val.greenspace.name}</div>
            <Link to={`/map/${val.greenspace._id}/${window.location.search}`}>
              <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" height="20px" title="View Greenspace"/>
            </Link>
          </div>
          <hr className="discover-hr"/>
          {events}
        </div>
      );
    });
  }

  render() {
    const { data, location } = this.state;

    var dataDiv = null;
    if (!location) {
      dataDiv = (
        <div>
          Greenspace needs your location to start discovering!
        </div>
      );
    } else if (data) {
      dataDiv = this.renderData(data);
    }

    return (
      <Sidebar ref="component" setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <h1>Discover</h1>
        {dataDiv}
      </Sidebar>
    );
  }
}

Discover.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
}

export default withRouter(Discover);

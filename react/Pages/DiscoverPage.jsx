import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Components/Sidebar.jsx';
import Services from '../../services';
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
          this.setState({data: res.content});
        });
    }
  }

  renderEvents(events) {
    if (events.length === 0) {
      return (<div id="upcoming-events">There are no upcoming events.</div>);
    }
    return (<div id="upcoming-events">
      <div id="upcoming-events-text">Upcoming Events:</div>
      <EventList events={events} />
    </div>);
  }

  renderData(data) {
    return data.map((val) => {
      const events = this.renderEvents(val.events);
      return (
        <div key={val.greenspace._id} className="discover-greenspace">
          {val.greenspace.name}
          {events}
        </div>
      );
    });
  }

  render() {

    const {
      data,
      location,
    } = this.state;

    let dataDiv;
    if (!location) {
      dataDiv = (
        <div>
          Greenspace needs your location to start discovering!
        </div>
      );
    }
    if (data) {
      dataDiv = this.renderData(data);
    }

    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <h1>Discover</h1>
        {dataDiv}
      </Sidebar>
    );
  }
}

Discover.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
}

export default Discover;

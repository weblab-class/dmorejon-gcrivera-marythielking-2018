import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Sidebar from '../Components/Sidebar.jsx';
import greenspaceServices from '../../services/greenspaceServices.js';
import eventServices from '../../services/eventServices.js';

class GreenspaceInfo extends Component {
  constructor(props){
    super(props);
    const gid = props.params.gid;

    this.state = {
      name: '',
      lat: 0,
      lng: 0,
      events: [],
    }

    greenspaceServices.info(gid)
      .then((res) => this.setState({
        name: res.content.name,
        lat: res.content.location[0],
        lng: res.content.location[1],
      }));

    eventServices.getAllByGreenspace(gid)
      .then((res) => this.setState({ events: res.content }))
      .catch((err) => console.log(err.error.err));

    this.renderEvents = this.renderEvents.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.renderStar = this.renderStar.bind(this);
  }

  renderEvents() {
    const { events } = this.state;
    if (events.length === 0) {
      return "There are no upcoming events.";
    }
    return events.map((e) => this.renderEvent(e));
  }

  renderEvent(e) {
    const { gid } = this.props.params;
    const { name } = e;
    return (<Link
      to={`/map/${gid}/event/${name}`}
      className="list-item-event"
      key={name}
    >{name}</Link>);
  }

  renderStar(s) {
    const rating = 3.5;
    if (s < rating) {
      return (<FontAwesome name="star" key={s} />);
    } else if (s - rating === 0.5) {
      return (<FontAwesome name="star-half-o" key={s} />);
    } else {
      return (<FontAwesome name="star-o" key={s} />);
    }
  }

  render(){
    const { gid } = this.props.params;
    const { name, lat, lng } = this.state;

    const dummyEvents = [
      { name: "Event 1" },
      { name: "Event 2" },
      { name: "Event 3" },
      { name: "Event 4" },
      { name: "Event 5" },
      { name: "Event 6" },
      { name: "Event 7" },
      { name: "Event 8" },
      { name: "Event 9" },
      { name: "Event 10" },
      { name: "Event 11" },
      { name: "Event 12" },
      { name: "Event 13" },
      { name: "Event 14" },
      { name: "Event 15" },
      { name: "Event 16" },
    ]
    const renderedEvents = this.renderEvents();
    const stars = [1,2,3,4,5].map((s) => this.renderStar(s));
    return (
      <Sidebar>
        <h1>{name}</h1>
        <div>
          Directions to {name}:
          <a href={`https://www.google.com/maps?saddr=My+Location&daddr=${lat},${lng}`} target="_blank">
            <img src="/images/google-maps-icon-2015.png" height="40px" className="gmaps-logo" />
          </a>
        </div>
        <div className="rating-stars">{stars}</div>
        <div className="list-items">{renderedEvents}</div>
        <Link to={`/map/${gid}/event/create/${window.location.search}`} id="add-event">
          <FontAwesome name="plus-square-o" size="2x" id="add-event-icon" />
          <div id="add-event-text">Create New Event</div>
        </Link>
      </Sidebar>
    );
  }
}

GreenspaceInfo.propTypes = {
}

export default withRouter(GreenspaceInfo);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';

import GreenspaceSidebar from '../Components/GreenspaceSidebar.jsx';
import Services from '../../services';
import { monthsMap } from '../constants.jsx'

class GreenspaceInfo extends Component {
  constructor(props){
    super(props);
    const gid = props.params.gid;

    this.state = {
      name: '',
      lat: 0,
      lng: 0,
      events: [],
      rating: null,
    };

    Services.greenspace.info(gid)
      .then((res) => this.setState({
        name: res.content.name,
        lat: res.content.location[0],
        lng: res.content.location[1],
      }));

    Services.event.getAllByGreenspace(gid)
      .then((res) => this.setState({ events: res.content }))
      .catch((err) => console.log(err.error.err));

    Services.review.getAllByGreenspace(gid)
      .then((res) => {
        if (res.content.reviews.length !== 0) {
          this.setState({ rating: res.content.rating })
        }
      })
      .catch((err) => console.log(err.error.err));

    this.renderEvents = this.renderEvents.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.renderRating = this.renderRating.bind(this);
  }

  renderEvents() {
    const { events } = this.state;
    if (events.length === 0) {
      return (<div id="upcoming-events">There are no upcoming events.</div>);
    }
    return (<div id="upcoming-events">
      <div id="upcoming-events-text">Upcoming Events:</div>
      <div className="list-items">
        {events.map((e) => this.renderEvent(e))}
      </div>
    </div>);
  }

  renderEvent(e) {
    const { gid } = this.props.params;
    const { name, _id, starttime } = e;

    const date = monthsMap[starttime.substring(5,7)]
      + " " + starttime.substring(8,10)
      + ", " + starttime.substring(0,4)
      + " at " + starttime.substring(11,16);

    return (<Link
      to={`/map/${gid}/event/${_id}/${window.location.search}`}
      className="list-item-event"
      key={name}
    >
      <div className="event-name">{name}</div>
      <div className="event-date">{date}</div>
    </Link>);
  }

  renderRating() {
    const { rating } = this.state;
    const { gid } = this.props.params;

    if (rating === null) {
      return (<Link to={`/map/${gid}/reviews/${window.location.search}`}>
        <div id="greenspace-rating-text">No Reviews</div>
      </Link>);
    }

    return (<div id="greenspace-rating">
      <div className="greenspace-rating-stars">
        <ReactStars value={rating} edit={false} color2="black" />
      </div>
      <Link to={`/map/${gid}/reviews/${window.location.search}`}>
        <div id="greenspace-rating-text">See Reviews</div>
      </Link>
    </div>);
  }

  render(){
    const { currentUser, setMapPlaceMarkers } = this.props;
    const { gid } = this.props.params;
    const { name, lat, lng, rating } = this.state;

    const renderedEvents = this.renderEvents();
    const renderedRating = this.renderRating();

    const createEvent = (
      <Link to={`/map/${gid}/event/create/${window.location.search}`} id="add-event">
        <FontAwesome name="plus-square-o" size="2x" id="add-event-icon" />
        <div id="add-event-text">Create New Event</div>
      </Link>
    );

    return (
      <GreenspaceSidebar
        setMapPlaceMarkers={setMapPlaceMarkers}
        name={name}
        lat={lat}
        lng={lng}
      >
        { renderedRating }
        { renderedEvents }
        { currentUser ? createEvent : '' }
      </GreenspaceSidebar>
    );
  }
}

GreenspaceInfo.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  currentUser: PropTypes.object,
}

export default withRouter(GreenspaceInfo);

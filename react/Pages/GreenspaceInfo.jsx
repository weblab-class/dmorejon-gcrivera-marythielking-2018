import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';

import GreenspaceSidebar from '../Components/GreenspaceSidebar.jsx';
import Services from '../../services';

class GreenspaceInfo extends Component {
  constructor(props){
    super(props);

    this.state = {
      name: '',
      lat: 0,
      lng: 0,
      events: [],
      rating: null,
    };

    this.renderEvents = this.renderEvents.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.renderRating = this.renderRating.bind(this);
  }

  componentDidMount() {
    const gid = this.props.params.gid;

    Services.greenspace.info(gid)
      .then((res) => this.setState({
        name: res.content.name,
        lat: res.content.location[0],
        lng: res.content.location[1],
      }));

    Services.event.getAllByGreenspace(gid)
      .then((res) => this.setState({ events: res.content }));

    Services.review.getAllByGreenspace(gid)
      .then((res) => {
        if (res.content.reviews.length !== 0) {
          this.setState({ rating: res.content.rating })
        }
      });
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
    const { name, _id, starttime } = e;
    const gid = this.props.params.gid

    const localStart = new Date(starttime).toString()
    const date = localStart.substring(4,10)
      + ", " + localStart.substring(11,15)
      + " at " + localStart.substring(16,21);

    return (<Link
      to={`/map/${gid}/event/${_id}/${window.location.search}`}
      className="list-item-event"
      key={_id}
    >
      <div className="event-name">{name}</div>
      <div className="event-date">{date}</div>
    </Link>);
  }

  renderRating() {
    const { rating } = this.state;
    const gid = this.props.params.gid

    if (rating === null && !this.props.currentUser) {
      return (<Link to={`/map/${gid}/reviews/${window.location.search}`}>
        <div id="greenspace-rating-text">No reviews</div>
      </Link>);
    }

    if (rating === null) {
      return (<Link to={`/map/${gid}/reviews/create/${window.location.search}`}>
        <div id="greenspace-rating-text">Write a Review</div>
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
    const { name, lat, lng, rating } = this.state;
    const gid = this.props.params.gid

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

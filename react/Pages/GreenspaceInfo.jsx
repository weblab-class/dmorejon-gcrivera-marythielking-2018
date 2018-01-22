import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';

import Sidebar from '../Components/Sidebar.jsx';
import Services from '../../services';

class GreenspaceInfo extends Component {
  constructor(props){
    super(props);
    const gid = props.params.gid;

    this.state = {
      name: '',
      lat: 0,
      lng: 0,
      events: [],
      rating: 0,
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
      .then((res) => this.setState({ rating: res.content.rating }))
      .catch((err) => console.log(err.error.err));

    this.renderEvents = this.renderEvents.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
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
    const { name, _id } = e;
    return (<Link
      to={`/map/${gid}/event/${_id}/${window.location.search}`}
      className="list-item-event"
      key={name}
    >{name}</Link>);
  }

  render(){
    const { currentUser } = this.props;
    const { gid } = this.props.params;
    const { name, lat, lng, rating } = this.state;

    const renderedEvents = this.renderEvents();

    const writeReview = (
      <Link to={`/map/${gid}/reviews/create/${window.location.search}`} id="write-review">
        <div id="write-review-text">Write a Review</div>
      </Link>
    );
    const createEvent = (
      <Link to={`/map/${gid}/event/create/${window.location.search}`} id="add-event">
        <FontAwesome name="plus-square-o" size="2x" id="add-event-icon" />
        <div id="add-event-text">Create New Event</div>
      </Link>
    );

    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <h1>{name}</h1>
        <div>
          Directions to {name}:
          <a href={`https://www.google.com/maps?saddr=My+Location&daddr=${lat},${lng}`} target="_blank">
            <img src="/images/google-maps-icon-2015.png" height="40px" className="gmaps-logo" />
          </a>
        </div>
        <ReactStars value={rating} edit={false} color2="black" />
        { currentUser ? writeReview : '' }
        <Link to={`/map/${gid}/reviews/${window.location.search}`} id="write-review">
          <div id="write-review-text">View Reviews</div>
        </Link>
        <div className="list-items">{renderedEvents}</div>
        { currentUser ? createEvent : '' }
      </Sidebar>
    );
  }
}

GreenspaceInfo.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  currentUser: PropTypes.object,
}

export default withRouter(GreenspaceInfo);

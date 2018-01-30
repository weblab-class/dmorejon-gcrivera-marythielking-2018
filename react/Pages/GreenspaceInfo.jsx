import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';

import GreenspaceSidebar from '../Components/GreenspaceSidebar.jsx';
import EventList from '../Components/EventList.jsx';
import TagSearch from '../Components/TagSearch.jsx';
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
      tags: [],
      updatePropTags: true,
    };

    this.renderEvents = this.renderEvents.bind(this);
    this.renderRating = this.renderRating.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
  }

  componentDidMount() {
    const gid = this.props.params.gid;

    Services.greenspace.info(gid)
      .then((res) => {
        if (this.refs.component) {
          this.setState({
            name: res.content.name,
            lat: res.content.location[0],
            lng: res.content.location[1],
            tags: res.content.tags,
          });
          this.setState({ updatePropTags: false });
          this.props.setMapViewFn(res.content.location);
        }
      });

    Services.event.getAllByGreenspace(gid)
      .then((res) => {
        if (this.refs.component) {
          this.setState({ events: res.content });
        }
      });

    Services.review.getAllByGreenspace(gid)
      .then((res) => {
        if (res.content.reviews.length !== 0 && this.refs.component) {
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
      <EventList events={events} maxHeight="300px" />
    </div>);
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

  handleAddTag(tags, tag) {
    Services.greenspace.addTag(this.props.params.gid, tag.name);
  }

  handleRemoveTag(tags, tag) {
    Services.greenspace.deleteTag(this.props.params.gid, tag.name);
  }

  render() {
    const { currentUser, setMapPlaceMarkers } = this.props;
    const { name, lat, lng, rating, tags } = this.state;
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
        backButton={false}
        ref="component"
        currentUser={currentUser}
      >
        { renderedRating }
        { renderedEvents }
        { currentUser ? createEvent : '' }
        <TagSearch
            handleAddTag={this.handleAddTag}
            handleRemoveTag={this.handleRemoveTag}
            propTags={tags}
            updateState={this.state.updatePropTags}
        />
      </GreenspaceSidebar>
    );
  }
}

GreenspaceInfo.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  currentUser: PropTypes.object,
}

export default withRouter(GreenspaceInfo);

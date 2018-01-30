import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import Promise from 'bluebird';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';

import PopUp from '../Components/PopUp.jsx';
import EventList from '../Components/EventList.jsx';
import Services from '../../services';

class UserView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      photo: null,
      reviews: [],
      events: [],
      pending: [],
      favorites: [],
    };

    this.updateEvents = this.updateEvents.bind(this);
    this.acceptEvent = this.acceptEvent.bind(this);
    this.declineEvent = this.declineEvent.bind(this);
    this.renderReviews = this.renderReviews.bind(this);
    this.renderReview = this.renderReview.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
    this.renderPending = this.renderPending.bind(this);
    this.renderPendingEvent = this.renderPendingEvent.bind(this);
    this.renderFavorites = this.renderFavorites.bind(this);
  }

  componentDidMount() {
    Services.review.getAllByUser()
      .then((res) => {
        if (this.refs.component) {
          this.setState({ reviews: res.content});
        }
      });

    Services.user.info()
      .then((res) => {
        if (this.refs.component) {
          this.setState({
            currentUser: res.content.displayname,
            photo: res.content.photo,
            favorites: res.content.favorites,
          });
        }
      });

    this.updateEvents();
  }

  updateEvents() {
    Services.event.getAllByUser()
      .then((res) => {
        if (this.refs.component && res.content) {
          this.setState({ events: res.content});
        }
      });

    Services.event.getAllPendingByUser()
      .then((res) => {
        if (this.refs.component && res.content) {
          this.setState({ pending: res.content});
        }
      });
  }

  acceptEvent(e, eventId) {
    e.preventDefault(); // don't link to event page
    Services.event.accept(eventId)
      .then((res) => {
        this.updateEvents();
      });
  }

  declineEvent(e, eventId) {
    e.preventDefault(); // don't link to event page
    Services.event.decline(eventId)
      .then((res) => {
        this.updateEvents();
      });
  }

  renderReviews() {
    const { reviews } = this.state;
    if (reviews.length === 0) {
      return (<div className="userview-col">
        <h1 className="section-header">You haven't written any reviews yet!</h1>
      </div>);
    } else {
      const renderedReviews = reviews.map((r) => this.renderReview(r));
      return (<div className="userview-col">
        <h1 className="section-header">Your Reviews:</h1>
        <div className="list-items">{renderedReviews}</div>
      </div>);
    };
  }

  renderReview(r) {
    return (<div className="list-item-review" key={r._id}>
      <div className='userview-rating-greenspace'>
        <ReactStars value={r.rating} edit={false} color2="black" />
        <div className='userview-review-greenspace'> {r.greenspace.name}</div>
      </div>
      {r.body}
    </div>);
  }

  renderEvents() {
    const { events } = this.state;
    const pendingEvents = this.renderPending();
    if (events.length === 0) {
      return (<div className='userview-col'>
        {pendingEvents}
        <h1 className="section-header">You aren't a part of any events yet!</h1>
      </div>);
    } else {
      return (<div className='userview-col'>
        {pendingEvents}
        <h1 className="section-header">Upcoming Events:</h1>
        <EventList events={events} inUserView={true}/>
      </div>);
    };
  }

  renderPending() {
    const { pending } = this.state;
    if (pending.length === 0) {
      return null;
    } else {
      const renderedPending = pending.map((p) => this.renderPendingEvent(p));
      return (<div>
        <h1 className="section-header">Event Invitations:</h1>
        <div className="list-items">{renderedPending}</div>
      </div>)
    }
  }

  renderPendingEvent(p) {
    const { name, _id, starttime, greenspace } = p;

    const localStart = new Date(starttime).toString()
    const date = localStart.substring(4,10)
      + ", " + localStart.substring(11,15)
      + " at " + localStart.substring(16,21);

    return (<Link
      to={`/map/${greenspace._id}/event/${_id}/${window.location.search}`}
      className="list-item-event list-item-pending"
      key={_id}
    >
      <div>
        <div className="event-name">{name}</div>
        <div className="event-date">{date}</div>
      </div>
      <div className="pending-btns" >
        <div className="pending-btn" onClick={(e) => this.acceptEvent(e, _id)}>
          <FontAwesome name="check" />
        </div>
        <div className="pending-btn" onClick={(e) => this.declineEvent(e, _id)}>
          <FontAwesome name="times" />
        </div>
      </div>
    </Link>);
  }

  renderFavorites() {
    const { favorites } = this.state;
    if (favorites.length === 0) {
      return (<div className="userview-col">
        <h1 className="section-header">You don't have any favorite greenspaces yet!</h1>
      </div>);
    } else {
      const renderedFavorites = favorites.map((f) => this.renderFavorite(f));
      return (<div className="userview-col">
        <h1 className="section-header">Favorite Greenspaces:</h1>
        <div className="list-items">{renderedFavorites}</div>
      </div>);
    };
  }

  renderFavorite(f) {
    return (
      <Link to={`/map/${f._id}/${window.location.search}`}
        className="list-item-event"
        key={f._id}
      >
        <div>{f.name}</div>
      </Link>
    );
  }

  render(){
    const {
      currentUser,
      photo,
    } = this.state;

    const renderedReviews = this.renderReviews();
    const renderedEvents = this.renderEvents();
    const renderedFavorites = this.renderFavorites();

    return (
      <div id='userview' ref="component">
        <div id="userview-user">
          <img src={photo} height="55px" className="profile-icon"/>
          <h1 id="userview-name">{currentUser}</h1>
        </div>
        <div id="userview-content">
          {renderedEvents}
          {renderedFavorites}
          {renderedReviews}
        </div>
      </div>
    );
  }
}

export default UserView;

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
    };
    console.log(props.currentUser);
    this.renderReviews = this.renderReviews.bind(this);
    this.renderReview = this.renderReview.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
  }

  componentDidMount() {
    Services.review.getAllByUser()
      .then((res) => {
        if (this.refs.component) {
          this.setState({ reviews: res.content});
        }
      });

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

  componentWillReceiveProps(newProps) {
    if (newProps.currentUser) {
      this.setState({
        currentUser: newProps.currentUser.displayname,
        photo: newProps.currentUser.photo,
      });
    }
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

  renderEvents(events) {
    if (events.length === 0) {
      return (<div className='userview-col'>
        <h1 className="section-header">You aren't a part of any events yet!</h1>
      </div>);
    } else {
      return (<div className='userview-col'>
        <h1 className="section-header">Your events: </h1>
        <EventList events={events} />
      </div>);
    };
  }

  render(){
    const {
      currentUser,
      photo,
      events,
      pending,
    } = this.state;

    const renderedReviews = this.renderReviews();
    const renderedEvents = this.renderEvents(events);
    const renderedPending = this.renderEvents(pending);

    return (
      <div id='userview' ref="component">
        <div id="userview-user">
          <img src={photo} height="80px" className="profile-icon"/>
          <h1 id="userview-name">{currentUser}</h1>
        </div>
        <div id="userview-content">
          {renderedEvents}
          {renderedReviews}
          {renderedPending}
        </div>
      </div>
    );
  }
}

UserView.propTypes = {
  currentUser: PropTypes.object,
};

export default UserView;

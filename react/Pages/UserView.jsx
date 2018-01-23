import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import PopUp from '../Components/PopUp.jsx';
import ReactStars from 'react-stars';
import Services from '../../services';
import Promise from 'bluebird';

class UserView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: props.currentUser.displayname,
      photo: props.currentUser.photo,
      reviews: [],
      events: [],
      reviews: [],
      reviewsCorrect: false,
    };

    Services.review.getAllByUser()
      .then((res) => {
        this.setState({ reviews: res.content});
      });

    Services.event.getAllByUser()
    .then((res) => {
      this.setState({ events: res.content});
    });

    this.renderEvents = this.renderEvents.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.renderReviews = this.renderReviews.bind(this);
    this.renderReview = this.renderReview.bind(this);
    }

    renderReviews() {
      const reviews = this.state.reviews;
      const renderedReviews = reviews.map((r) => this.renderReview(r));
      Promise.all(renderedReviews).then((renderedReviews) => {
        this.setState({ reviews: renderedReviews , reviewsCorrect: true });
        return;
      });
    }

    renderReview(r) {
      return Services.greenspace.info(r.greenspace)
      .then((res) => {
        const greenspaceName = res.content.name;
        r.greenspace = greenspaceName;
        return r;
      });
    }

    reviewDivs(reviews) {
      return reviews.map((r) => {
        return (<div className="list-item-review" key={r._id}>
          <ReactStars value={r.rating} edit={false} color2="black" />
            <div> for: {r.greenspace}</div>
          {r.body}
        </div>)
      })
    }


  renderEvents() {
    const { events } = this.state;
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
    const {
      currentUser,
      photo,
      reviews,
      events,
      reviewsCorrect
    } = this.state;

    const renderedEvents = this.renderEvents();
    let reviewDivList = null;
    if(reviews.length !== 0 && !reviewsCorrect) {this.renderReviews();}
    else if (reviews.length !== 0) {reviewDivList = this.reviewDivs(this.state.reviews);}
    let reviews_div;
    let events_div;

    if (reviews.length === 0) {
      reviews_div = (
        <div id = 'ratings'>
          <h1 className="section-header">you haven't written any reviews yet!</h1>
        </div>
      )
    } else {
      reviews_div = (
        <div id = 'ratings'>
          <h1 className="section-header"> reviews you've written:</h1>
          <div className="list-items">{reviewDivList}</div>
        </div>
      )
    };

    if (events.length === 0) {
      events_div = (
        <div id = 'events'>
          <h1 className="section-header">you aren't a part of any events yet!</h1>
        </div>
      )
    } else {
      events_div = (
        <div id = 'events'>
          <h1 className="section-header"> events you're a part of: </h1>
            <div className="list-items">{renderedEvents}</div>
        </div>
      )
    };
    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly}>
        <div id = 'user'>
          <h1 className="section-header">{currentUser}</h1>
              <img src={photo} height="80px" className="profile-icon"/>
        </div>
        {reviews_div}
        {events_div}
        <Link
          to={`/map/`}
          className="btn"
        >back</Link>
      </PopUp>
    );
  }
}

UserView.propTypes = {
  currentUser: PropTypes.object,
  setMapViewOnly: PropTypes.func,
};

export default UserView;

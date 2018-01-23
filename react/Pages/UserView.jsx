import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import PopUp from '../Components/PopUp.jsx';
import ReactStars from 'react-stars';
import Services from '../../services';
import Promise from 'bluebird';
import FontAwesome from 'react-fontawesome';

class UserView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      photo: null,
      reviews: [],
      events: [],
      reviews: [],
      reviewsCorrect: false,
    };

    this.renderEvents = this.renderEvents.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.renderReviews = this.renderReviews.bind(this);
    this.renderReview = this.renderReview.bind(this);
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
          if (this.refs.component) {
            this.setState({ events: res.content});
          }
        });
    }

    componentWillReceiveProps(newProps) {
      if(newProps.currentUser) {
        this.setState({ currentUser: newProps.currentUser.displayname, photo: newProps.currentUser.photo });
      }
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
        return (
          <div className="list-item-review userview" key={r._id}>
          <div className='userview-review-greenspace'>
            <ReactStars value={r.rating} edit={false} color2="black" />
            <div className = 'userview-greenspace'> {r.greenspace}</div>
          </div>
          <div className = 'userview-review-body'>
            {r.body}
          </div>

        </div>)
      })
    }


  renderEvents() {
    const { events } = this.state;
    return events.map((e) => this.renderEvent(e));
  }

  renderEvent(e) {
    const { name, _id, greenspace } = e;
    return (<Link
      to={`/map/${greenspace}/event/${_id}/${window.location.search}`}
      className="list-item-event userview"
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
        <div className = 'userview-ratings'>
          <h1 className="section-header">You haven't written any reviews yet!</h1>
        </div>
      )
    } else {
      reviews_div = (
        <div id = 'userview-ratings'>
          <h1 className="section-header">Your Reviews:</h1>
          <div className="list-items">{reviewDivList}</div>
        </div>
      )
    };

    if (events.length === 0) {
      events_div = (
        <div className = 'userview-events'>
          <h1 className="section-header">You aren't a part of any events yet!</h1>
        </div>
      )
    } else {
      events_div = (
        <div className = 'userview-events'>
          <h1 className="section-header">Your events: </h1>
            <div className="list-items">{renderedEvents}</div>
        </div>
      )
    };

    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly} ref="component">

        <div id="userview-close-btn">
          <Link to={`/map/${window.location.search}`} id="close-btn">
            <FontAwesome name="times" size="lg" title="Close"/>
          </Link>
        </div>
        <div id='userview'>
          <div className = 'userview-user'>
            <h1 id="userview-name">{currentUser}</h1>
                <img src={photo} height="100px" className="profile-icon"/>
          </div>
          {reviews_div}
          {events_div}
        </div>
      </PopUp>
    );
  }
}

UserView.propTypes = {
  currentUser: PropTypes.object,
  setMapViewOnly: PropTypes.func,
};

export default UserView;

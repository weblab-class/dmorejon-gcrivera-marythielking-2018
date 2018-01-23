import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';
import Sidebar from '../Components/Sidebar.jsx';
import reviewServices from '../../services/reviewServices.js';

class ReviewView extends Component {
  constructor(props){
    super(props);
    const gid = props.params.gid;

    this.state = {
      reviews: [],
      rating: 0,
    };

    reviewServices.getAllByGreenspace(gid)
      .then((res) => this.setState(res.content))
      .catch((err) => console.log(err));

    this.renderReviews = this.renderReviews.bind(this);
    this.renderReview = this.renderReview.bind(this);
  }

  renderReviews() {
    const { reviews } = this.state;

    if (reviews.length === 0) {
      return "There are no reviews.";
    }
    return reviews.map((r) => this.renderReview(r));
  }

  renderReview(r) {
    const { gid } = this.props.params;
    const { body, rating } = r;
    return (<div className="list-item-review" key={body}>
      <ReactStars value={rating} edit={false} color2="black" />
      {body}
    </div>);
  }

  render(){
    const { currentUser } = this.props;
    const { gid } = this.props.params;
    const renderedReviews = this.renderReviews();

    let writeReview;
    const matchedUserArray = this.state.reviews.filter((r) => r.user.fbid === this.props.currentUser.fbid);
    if (matchedUserArray.length > 0) {
      writeReview = null;
    } else {
      writeReview = (
        <Link to={`/map/${gid}/reviews/create/${window.location.search}`}>
          <div>Write a Review</div>
        </Link>
      );
    }

    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <Link to={`/map/${this.props.params.gid}/${window.location.search}`} id="back-button">
          <FontAwesome name="chevron-left" size="2x" id="back-button-icon" />
        </Link>
        <h1 className="section-header">Reviews</h1>
        <div className="list-items">{renderedReviews}</div>
        { currentUser ? writeReview : null }
      </Sidebar>
    );
  }
}

ReviewView.propTypes = {
  currentUser: PropTypes.object,
}

export default withRouter(ReviewView);

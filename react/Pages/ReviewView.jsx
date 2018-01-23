import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';

import GreenspaceSidebar from '../Components/GreenspaceSidebar.jsx';
import reviewServices from '../../services/reviewServices.js';
import greenspaceServices from '../../services/greenspaceServices.js';

class ReviewView extends Component {
  constructor(props){
    super(props);

    this.state = {
      reviews: [],
      rating: 0,

      greenspaceName: '',
      lat: 0,
      lng: 0,
    };

    this.renderReviews = this.renderReviews.bind(this);
    this.renderReview = this.renderReview.bind(this);
  }

  componentDidMount() {
    const gid = this.props.params.gid;

    this.props.getGreenspaceInfo(gid, (info) => this.setState(info));

    reviewServices.getAllByGreenspace(gid)
      .then((res) => this.setState(res.content))
      .catch((err) => console.log(err));
  }

  renderReviews() {
    const { reviews } = this.state;

    if (reviews.length === 0) {
      return null;
    }
    return (
      <div className="list-items">
        {reviews.map((r) => this.renderReview(r))}
      </div>)
    ;
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
    const {
      greenspaceName,
      lat,
      lng,
      reviews,
    } = this.state;

    const renderedReviews = this.renderReviews();

    let writeReview = null;
    if (currentUser) {
      const matchedUserArray = reviews.filter((r) => r.user.fbid === this.props.currentUser.fbid);
      if (matchedUserArray.length === 0) {
        writeReview = (
          <Link to={`/map/${gid}/reviews/create/${window.location.search}`}>
            <div id="greenspace-rating-text">Write a Review</div>
          </Link>
        );
      }
    } else {
      if (reviews.length === 0) {
        writeReview = (<div className="section-header">There are no reviews.</div>);
      }
    }

    return (
      <GreenspaceSidebar
        setMapPlaceMarkers={this.props.setMapPlaceMarkers}
        name={greenspaceName}
        lat={lat}
        lng={lng}
      >
        { (reviews.length > 0) ? (<div className="section-header">Reviews:</div>) : null }
        { writeReview }
        { renderedReviews }
      </GreenspaceSidebar>
    );
  }
}

ReviewView.propTypes = {
  currentUser: PropTypes.object,
  getGreenspaceInfo: PropTypes.func,
}

export default withRouter(ReviewView);

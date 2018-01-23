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
    const gid = props.params.gid;

    this.state = {
      reviews: [],
      rating: 0,
      greenspaceName: '',
      lat: 0,
      lng: 0,
    };

    greenspaceServices.info(gid)
      .then((res) => this.setState({
        greenspaceName: res.content.name,
        lat: res.content.location[0],
        lng: res.content.location[1],
      }));

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
    const { greenspaceName, lat, lng } = this.state;
    const renderedReviews = this.renderReviews();

    const writeReview = (
      <Link to={`/map/${gid}/reviews/create/${window.location.search}`} id="add-event">
        <FontAwesome name="plus-square-o" size="2x" id="add-event-icon" />
        <div id="add-event-text">Write a Review</div>
      </Link>
    );

    return (
      <GreenspaceSidebar
        setMapPlaceMarkers={this.props.setMapPlaceMarkers}
        name={greenspaceName}
        lat={lat}
        lng={lng}
        backTo={`/map/${this.props.params.gid}/${window.location.search}`}
      >
        <h1 className="section-header">Reviews</h1>
        <div className="list-items">{renderedReviews}</div>
        { currentUser ? writeReview : '' }
      </GreenspaceSidebar>
    );
  }
}

ReviewView.propTypes = {
  currentUser: PropTypes.object,
}

export default withRouter(ReviewView);

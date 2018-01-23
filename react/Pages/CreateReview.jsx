import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';

import GreenspaceSidebar from '../Components/GreenspaceSidebar.jsx';
import reviewServices from '../../services/reviewServices.js';

class CreateReview extends Component {
  constructor(props){
    super(props);
    this.state = {
      gid: props.params.gid,

      reviewVal: '',
      rating: 0,
      greenspaceName: '',
      lat: 0,
      lng: 0,
    };

    this.updateFormVal = this.updateFormVal.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.setRating = this.setRating.bind(this);
    this.create = this.create.bind(this);
  }

  componentDidMount() {
    const gid = this.props.params.gid;
    this.props.getGreenspaceInfo(gid, (info) => this.setState(info));
  }

  updateFormVal(event){
    const updatedField = event.target.name;
    const updatedValue = event.target.value;
    this.setState((prevState) => {
      prevState[updatedField] = updatedValue;
      return prevState;
    });
  }

  onKeyPress(e){
    if(e.which === 13) {
      this.create();
    }
  }

  setRating(rating) {
    this.setState({ rating });
  }

  create() {
    const {
      gid,
      reviewVal,
      rating
    } = this.state;

    const time = new Date();

    reviewServices.create(gid, rating, reviewVal, time)
      .then((res) => {
        this.props.router.push(`/map/${res.content.greenspace}/reviews/${window.location.search}`);
      });
  }

  render(){
    const {
      reviewVal,
      rating,
      greenspaceName,
      lat,
      lng,
    } = this.state;

    return (
      <GreenspaceSidebar
        setMapPlaceMarkers={this.props.setMapPlaceMarkers}
        name={greenspaceName}
        lat={lat}
        lng={lng}
      >
        <div className="section-header">Create Review</div>
        <ReactStars value={rating} onChange={this.setRating} color2="black" />
        <div className="form">
          <textarea autoFocus className='form-input'
            name='reviewVal'
            placeholder='review content'
            value={reviewVal}
            onChange={this.updateFormVal}
            onKeyPress={this.onKeyPress}
          />
          <div className="btn" onClick={this.create}>Create</div>
        </div>
      </GreenspaceSidebar>
    );
  }
}

CreateReview.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  getGreenspaceInfo: PropTypes.func,
}

export default withRouter(CreateReview);

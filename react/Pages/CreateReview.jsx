import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';
import Sidebar from '../Components/Sidebar.jsx';
import reviewServices from '../../services/reviewServices.js';

class CreateReview extends Component {
  constructor(props){
    super(props);
    this.state = {
      gid: props.params.gid,

      reviewVal: '',
      rating: 0,
    };

    this.updateFormVal = this.updateFormVal.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.setRating = this.setRating.bind(this);
    this.create = this.create.bind(this);
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
        console.log(res.content);
        this.props.router.push(`/map/${res.content._id}/reviews/${window.location.search}`);
      })
      .catch((err) => console.log(err.error.err));
  }

  render(){
    const { reviewVal, rating } = this.state;

    return (
      <Sidebar>
        <Link to={`/map/${this.props.params.gid}/${window.location.search}`} id="back-button">
          <FontAwesome name="chevron-left" size="2x" id="back-button-icon" />
        </Link>
        <h1 className="section-header">Create Review</h1>
        <ReactStars value={rating} onChange={this.setRating} color2="black" />
        <div className="form">
          <input autoFocus className='form-input'
            name='reviewVal'
            placeholder='review content'
            value={reviewVal}
            onChange={this.updateFormVal}
            onKeyPress={this.onKeyPress}
          />
          <div className="btn" onClick={this.create}>Create</div>
        </div>
      </Sidebar>
    );
  }
}

export default withRouter(CreateReview);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../Components/PopUp.jsx';
import Services from '../../services';


class UserView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: '',
      photo: '',
      reviews: [],
      events: []
    };

    let {
      currentUser,

    } = this.props;

    Services.user.info()
      .then((res) => {
        this.setState({ currentUser: res.content.displayname , photo: res.content.photo});
      });

    Services.review.getAllByUser()
      .then((res) => {
        this.setState({ reviews: res.content});
      });

    Services.event.getAllByUser()
    .then((res) => {
      this.setState({ events: res.content});
    });
  }

  render(){
    let {
      currentUser,
    } = this.props;
    console.log(this.state);
    currentUser = this.state.currentUser;
    const photo = this.state.photo;
    const reviews = this.state.reviews;
    const events = this.state.events;
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
          <h1 className="section-header"> reviews you've written </h1>
          //display reviews here
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
          <h1 className="section-header"> events you're a part of </h1>
          //display events here
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
        <div id = 'events'> </div>
      </PopUp>
    );
  }
}

UserView.propTypes = {
  currentUser: PropTypes.string,
  setMapViewOnly: PropTypes.func,
};

export default UserView;

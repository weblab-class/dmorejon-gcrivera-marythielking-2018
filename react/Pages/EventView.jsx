import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Sidebar from '../Components/Sidebar.jsx';
import eventServices from '../../services/eventServices.js';
import userServices from '../../services/userServices.js';

class EventView extends Component {
  constructor(props){
    super(props);
    const eventId = props.params.eventId;

    this.state = {bottomButton: null, buttonRendered: false};

    eventServices.info(eventId)
      .then((res) => this.setState(res.content))
      .catch((err) => console.log(err));

      this.handleButton = this.handleButton.bind(this);
  }

  handleButton() {
    eventServices.join(this.props.params.eventId)
    .then((res) => {
      console.log(this.props.params);
      this.props.router.push(`/map/${this.props.params.gid}/${window.location.search}`);
    });

  }

  render(){
    const {
      name,
      description,
      starttime,
      endtime,
      participants,
    } = this.state;

    let startDate = '';
    let startHour = '';
    let endDate = '';
    let endHour = '';
    let bottomButton = this.state.bottomButton;

    if (starttime && endtime) {
      startDate = starttime.substring(0,10);
      startHour = starttime.substring(11,16);
      endDate = endtime.substring(0,10);
      endHour = endtime.substring(11,16);
    }

    let back_link;
    let user_id;
    if (this.props.params.gid !== 'undefined') {
      back_link =
        <Link to={`/map/${this.props.params.gid}/${window.location.search}`} id="back-button">
          <FontAwesome name="chevron-left" size="2x" id="back-button-icon" />
        </Link>
    } else {
      userServices.info()
        .then((res) => {
          user_id = res.content._id;
        });
      back_link =
        <Link to={`/user/${user_id}`} id="back-button">
          <FontAwesome name="chevron-left" size="2x" id="back-button-icon" />
        </Link>
    }
    if (participants){
      const matchedUserArray = participants.filter((u) => u.fbid === this.props.currentUser.fbid);
      if (!matchedUserArray.length>0 && !this.state.buttonRendered) {
        bottomButton = <div className="btn" onClick={this.handleButton}>join this event</div>
        this.state.buttonRendered = true;
      } else if (matchedUserArray.length>0){
        bottomButton = <div>You are attending this event</div>
      }
    }


    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        {back_link}
        <h1 className="section-header">{name}</h1>
        <div>{description}</div>
        <div>{startDate} {startHour} to {endDate} {endHour}</div>
        {bottomButton}
      </Sidebar>
    );
  }
}

EventView.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
}

export default withRouter(EventView);

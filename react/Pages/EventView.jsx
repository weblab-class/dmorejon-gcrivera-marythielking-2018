import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';

import GreenspaceSidebar from '../Components/GreenspaceSidebar.jsx';
import eventServices from '../../services/eventServices.js';
import userServices from '../../services/userServices.js';

class EventView extends Component {
  constructor(props){
    super(props);

    this.state = {
      greenspaceName: '',
      lat: 0,
      lng: 0,
      bottomButton: null,
      buttonRendered: false,
    };

    this.joinButton = this.joinButton.bind(this);
    this.leaveButton = this.leaveButton.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  componentDidMount() {
    const { gid, eventId } = this.props.params;

    this.props.getGreenspaceInfo(gid, (info) => this.setState(info));

    eventServices.info(eventId)
      .then((res) => this.setState(res.content))
      .catch((err) => console.log(err));
  }

  redirect() {
    if (this.props.params.gid !== 'undefined') {
      this.props.router.push(`/map/${this.props.params.gid}/${window.location.search}`);
    } else {
      this.props.router.push(`/user/${this.props.currentUser._id}`);
    }
  }

  joinButton() {
    eventServices.join(this.props.params.eventId)
    .then((res) => {
      this.redirect();
    });
  }

  leaveButton() {
    eventServices.leave(this.props.params.eventId, this.props.currentUser)
    .then((res) => {
      this.redirect();
    });
  }

  deleteEvent() {
    eventServices.delete(this.state._id)
    .then((res) => {
      this.redirect();
    });
  }

  render(){
    const {
      name,
      description,
      starttime,
      endtime,
      participants,
      host,
      greenspaceName,
      lat,
      lng,
    } = this.state;

    let localStart = '';
    let localEnd = '';
    if (starttime && endtime) {
      localStart = (new Date(starttime)).toString().substring(0, 21); // You can change substring but you must work with (new Date(starttime)).toString()
      localEnd = (new Date(endtime)).toString().substring(0, 21);
    }

    let deleteBtn;
    if (host && this.props.currentUser) {
      if (host.fbid === this.props.currentUser.fbid) {
        deleteBtn = (
          <Link onClick={this.deleteEvent} className="delete-btn" id="delete-event">
            <FontAwesome name="trash" id="delete-event-icon" title="Delete"/>
            <div id="delete-event-text">Delete Event</div>
          </Link>
        )
      }
    }

    let bottomButton = this.state.bottomButton;

    let backLink;
    let userId;
    if (this.props.params.gid !== 'undefined') {
      backLink = `/map/${this.props.params.gid}/${window.location.search}`
    } else {
      userServices.info()
        .then((res) => {
          userId = res.content._id;
        });
      backLink = `/user/${this.props.currentUser._id}`
    }
    if (participants){
      const matchedUserArray = participants.filter((u) => u.fbid === this.props.currentUser.fbid);
      if (!matchedUserArray.length > 0 && !this.state.buttonRendered) {
        bottomButton =
          <div className="btn" onClick={this.joinButton}>join this event</div>;
        this.state.buttonRendered = true;
      } else if (matchedUserArray.length > 0 && this.props.currentUser.fbid !== host.fbid){
        bottomButton =
          <div className="btn" onClick={this.leaveButton}>leave this event</div>;
      }
    }


    return (
      <GreenspaceSidebar
        setMapPlaceMarkers={this.props.setMapPlaceMarkers}
        name={greenspaceName}
        lat={lat}
        lng={lng}
        backTo={backLink}
      >
        <div id="event-header">
          <div className="section-header">{name}</div>
          {deleteBtn}
        </div>
        <div>{description}</div>
        <div>{localStart} to {localEnd}</div>
        {bottomButton}
      </GreenspaceSidebar>
    );
  }
}

EventView.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  getGreenspaceInfo: PropTypes.func,
}

export default withRouter(EventView);

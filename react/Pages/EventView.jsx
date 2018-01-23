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
    };

    this.deleteEvent = this.deleteEvent.bind(this);
  }

  componentDidMount() {
    const { gid, eventId } = this.props.params;

    this.props.getGreenspaceInfo(gid, (info) => this.setState(info));

    eventServices.info(eventId)
      .then((res) => this.setState(res.content))
      .catch((err) => console.log(err));
  }

  deleteEvent() {
    eventServices.delete(this.state._id)
    .then((res) => {
      this.props.router.push(`/map/${this.props.params.gid}/${window.location.search}`);
    });
  }

  render(){
    const {
      name,
      description,
      starttime,
      endtime,
      host,
      greenspaceName,
      lat,
      lng,
    } = this.state;

    let deleteBtn;
    if (host && this.props.currentUser) {
      if (host.fbid === this.props.currentUser.fbid) {
        deleteBtn = (
          <Link onClick={this.deleteEvent} className="delete-btn" id="delete-event">
            <FontAwesome name="trash" id="delete-event-icon" />
            <div id="delete-event-text">Delete Event</div>
          </Link>
        )
      }
    }

    let startDate = '';
    let startHour = '';
    let endDate = '';
    let endHour = '';

    if (starttime && endtime) {
      startDate = starttime.substring(0,10);
      startHour = starttime.substring(11,16);
      endDate = endtime.substring(0,10);
      endHour = endtime.substring(11,16);
    }

    let backLink;
    let userId;
    if (this.props.params.gid !== 'undefined') {
      backLink = `/map/${this.props.params.gid}/${window.location.search}`
    } else {
      userServices.info()
        .then((res) => {
          userId = res.content._id;
        });
      backLink = `/user/${userId}`
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
          <h1 className="section-header">{name}</h1>
          {deleteBtn}
        </div>
        <div>{description}</div>
        <div>{startDate} {startHour} to {endDate} {endHour}</div>

      </GreenspaceSidebar>
    );
  }
}

EventView.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  getGreenspaceInfo: PropTypes.func,
}

export default withRouter(EventView);

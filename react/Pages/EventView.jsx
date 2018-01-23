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

    this.state = {};

    eventServices.info(eventId)
      .then((res) => this.setState(res.content))
      .catch((err) => console.log(err));

      this.deleteEvent = this.deleteEvent.bind(this);
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

    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        {back_link}
        <div id="event-header">
          <h1 className="section-header">{name}</h1>
          {deleteBtn}
        </div>
        <div>{description}</div>
        <div>{startDate} {startHour} to {endDate} {endHour}</div>

      </Sidebar>
    );
  }
}

EventView.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
}

export default withRouter(EventView);

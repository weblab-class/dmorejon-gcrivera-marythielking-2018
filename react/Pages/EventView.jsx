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

    this.joinButton = this.joinButton.bind(this);
    this.leaveButton = this.leaveButton.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.renderTime = this.renderTime.bind(this);
    this.renderDeleteBtn = this.renderDeleteBtn.bind(this);
    this.renderJoinLeaveBtn = this.renderJoinLeaveBtn.bind(this);
    this.renderParticipants = this.renderParticipants.bind(this);
    this.renderParticipant = this.renderParticipant.bind(this);
  }

  componentDidMount() {
    const { gid, eventId } = this.props.params;

    this.props.getGreenspaceInfo(gid, (info) => {
      if (this.refs.component) {
        this.setState(info)
      }
    });

    eventServices.info(eventId)
      .then((res) => {
        if (this.refs.component) {
          this.setState(res.content);
        }
      })
      .catch((err) => console.log(err));
  }

  joinButton() {
    const { gid, eventId } = this.props.params;
    eventServices.join(this.props.params.eventId)
      .then((res) => {
        this.setState({ participants: res.content.participants });
      });
  }

  leaveButton() {
    const { gid, eventId } = this.props.params;
    eventServices.leave(this.props.params.eventId, this.props.currentUser)
      .then((res) => {
        this.setState({ participants: res.content.participants });
      });
  }

  deleteEvent() {
    const { gid } = this.props.params;
    eventServices.delete(this.state._id)
      .then((res) => {
        this.props.router.goBack();
      });
  }

  renderTime() {
    const {
      starttime,
      endtime,
    } = this.state;

    const localStart = (new Date(starttime)).toString();
    const localEnd = (new Date(endtime)).toString().substring(0, 21);

    const date = localStart.substring(0,3)
      + ", " + localStart.substring(4,10)
      + ", " + localStart.substring(11,15);
    const start = localStart.substring(16,21);
    const end = localEnd.substring(16,21);

    return (<div id="event-time">
      <div>{date}</div>
      <div>{start} to {end}</div>
    </div>);
  }

  renderDeleteBtn() {
    const { currentUser } = this.props;
    const { host } = this.state;
    if (host && currentUser) {
      if (host.fbid === currentUser.fbid) {
        return (
          <Link onClick={this.deleteEvent} className="delete-btn" id="delete-event">
            <FontAwesome name="trash" size="lg" />
          </Link>
        );
      }
    }
    return null;
  }

  renderJoinLeaveBtn() {
    const { currentUser } = this.props;
    const { participants, host } = this.state;

    if (participants && currentUser){
      const matchedUserArray = participants.filter((u) => u.fbid === currentUser.fbid);
      if (matchedUserArray.length === 0) {
        return (<div id="add-event" onClick={this.joinButton}>
          <FontAwesome name="calendar-plus-o" size="2x" id="calendar-icon" />
          <div id="add-event-text">Join This Event</div>
        </div>);
      } else if (matchedUserArray.length > 0 && currentUser.fbid !== host.fbid) {
        return (<div id="add-event" onClick={this.leaveButton}>
          <FontAwesome name="calendar-minus-o" size="2x" id="calendar-icon" />
          <div id="add-event-text">Leave This Event</div>
        </div>);
      }
    }
    return null;
  }

  renderParticipants() {
    const { participants } = this.state;
    if (!participants) { return null; }
    const participantList = participants.map((p) => this.renderParticipant(p));
    return (<div>
      <div className="section-header">Participants:</div>
      <div className="list-items">{participantList}</div>
    </div>);
  }

  renderParticipant(p) {
    return (<div key={p._id} className="list-item-participant event-participant">
        <img src={p.photo} height="30px" className="profile-icon" id="search-icon" />
        {p.displayname}
    </div>)
  }

  render(){
    const { currentUser, params } = this.props;
    const {
      name,
      description,
      greenspaceName,
      lat,
      lng,
    } = this.state;

    const renderedTime = this.renderTime();
    const deleteBtn = this.renderDeleteBtn();
    const joinLeaveBtn = this.renderJoinLeaveBtn();
    const renderedParticipants = this.renderParticipants();

    return (
      <GreenspaceSidebar
        setMapPlaceMarkers={this.props.setMapPlaceMarkers}
        name={greenspaceName}
        lat={lat}
        lng={lng}
        ref="component"
      >
        <div id="event-header">
          <div className="section-header" id="event-name">{name}</div>
          {deleteBtn}
        </div>
        {renderedTime}
        <div id="event-description">{description}</div>
        {renderedParticipants}
        {joinLeaveBtn}
      </GreenspaceSidebar>
    );
  }
}

EventView.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  getGreenspaceInfo: PropTypes.func,
}

export default withRouter(EventView);

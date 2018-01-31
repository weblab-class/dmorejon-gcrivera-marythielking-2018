import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import find from 'lodash/find';

import GreenspaceSidebar from '../Components/GreenspaceSidebar.jsx';
import TagSearch from '../Components/TagSearch.jsx';
import TagDisplay from '../Components/TagDisplay.jsx';
import UserSearch from '../Components/UserSearch.jsx';

import eventServices from '../../services/eventServices.js';
import userServices from '../../services/userServices.js';


class EventView extends Component {
  constructor(props){
    super(props);

    this.state = {
      greenspaceName: '',
      lat: 0,
      lng: 0,
      tags: [],
      updatePropTags: true,
      showUserSearch: false,
    };

    this.joinButton = this.joinButton.bind(this);
    this.leaveButton = this.leaveButton.bind(this);
    this.acceptButton = this.acceptButton.bind(this);
    this.declineButton = this.declineButton.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.renderTime = this.renderTime.bind(this);
    this.renderDeleteBtn = this.renderDeleteBtn.bind(this);
    this.renderBtn = this.renderBtn.bind(this);
    this.renderParticipants = this.renderParticipants.bind(this);
    this.renderPending = this.renderPending.bind(this);
    this.renderParticipant = this.renderParticipant.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.renderAddUserBtn = this.renderAddUserBtn.bind(this);
  }

  componentDidMount() {
    const { gid, eventId } = this.props.params;

    this.props.getGreenspaceInfo(gid, (info) => {
      if (this.refs.component) {
        this.setState(info)
        this.props.setMapViewFn([this.state.lat, this.state.lng]);
      }
    });
    eventServices.info(eventId)
      .then((res) => {
        if (this.refs.component) {
          this.setState(res.content);
          this.setState({ updatePropTags: false });
        }
      })
      .catch((err) => console.log(err));
  }

  joinButton() {
    const { eventId } = this.props.params;
    eventServices.join(eventId)
      .then((res) => {
        this.setState({ participants: res.content.participants });
      });
  }

  leaveButton() {
    const { eventId } = this.props.params;
    eventServices.leave(eventId, this.props.currentUser)
      .then((res) => {
        this.setState({ participants: res.content.participants });
      });
  }

  acceptButton() {
    const { eventId } = this.props.params;
    eventServices.accept(eventId)
      .then((res) => {
        this.setState({
          pending: res.content.pending,
          participants: res.content.participants,
        });
      });
  }

  declineButton() {
    const { eventId } = this.props.params;
    eventServices.decline(eventId)
      .then((res) => {
        this.setState({
          pending: res.content.pending,
          participants: res.content.participants,
        });
      });
  }

  deleteEvent() {
    const { gid } = this.props.params;
    eventServices.delete(this.state._id)
      .then((res) => {
        this.props.router.goBack();
      });
  }

  handleAddTag(tags, tag) {
    eventServices.addTag(this.props.params.eventId, tag.name);
  }

  handleRemoveTag(tags, tag) {
    eventServices.deleteTag(this.props.params.eventId, tag.name);
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

  renderBtn() {
    const { currentUser } = this.props;
    const { participants, pending, host } = this.state;

    if (participants && currentUser) {
      const userParticipant = participants.filter((u) => u.fbid === currentUser.fbid);
      const userPending = pending.filter((u) => u.fbid === currentUser.fbid);

      if (userPending.length > 0) {
        return (<div>
          <div id="add-event" onClick={this.acceptButton}>
            <FontAwesome name="calendar-plus-o" size="2x" id="calendar-icon" />
            <div id="add-event-text">Accept Invitation</div>
          </div>
          <div id="add-event" onClick={this.declineButton}>
            <FontAwesome name="calendar-minus-o" size="2x" id="calendar-icon" />
            <div id="add-event-text">Decline Invitation</div>
          </div>
        </div>);
      } else if (userParticipant.length === 0) {
        return (<div id="add-event" onClick={this.joinButton}>
          <FontAwesome name="calendar-plus-o" size="2x" id="calendar-icon" />
          <div id="add-event-text">Join This Event</div>
        </div>);
      } else if (userParticipant.length > 0 && currentUser.fbid !== host.fbid) {
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

  renderPending() {
    const { currentUser } = this.props;
    const { pending, host } = this.state;
    if (!pending || pending.length === 0) { return null; }
    if (host && currentUser) {
      if (host.fbid === currentUser.fbid) {
        const pendingList = pending.map((p) => this.renderParticipant(p));
        return (<div id="pending-users">
          <div className="section-header">Invited Users:</div>
          <div className="list-items">{pendingList}</div>
        </div>);
      }
    }
    return null;
  }

  renderParticipant(p) {
    return (<div key={p._id} className="list-item-participant event-participant">
        <img src={p.photo} height="30px" className="profile-icon" id="search-icon" />
        {p.displayname}
    </div>)
  }

  renderTags() {
    const { currentUser } = this.props;
    const { host, tags, updatePropTags } = this.state;
    if (host && currentUser) {
      if (host.fbid === currentUser.fbid) {
        return (
          <div>
            <div className= "section-header">Event Tags:</div>
            <TagSearch
              handleAddTag={this.handleAddTag}
              handleRemoveTag={this.handleRemoveTag}
              propTags={tags}
              updateState={updatePropTags}
            />
         </div>);
      } else {
        return (
          <div>
            <div className= "section-header">Event Tags:</div>
            <TagDisplay propTags={tags} />
          </div>

        )
      }
    }
  }

  handleUser(user) {
    const { eventId } = this.props.params;
    console.log(user);
    eventServices.invite(eventId, user)
      .then(() => {
        this.state.pending.concat(user);
      });
  }


  renderAddUserBtn() {
    const { currentUser } = this.props;
    const { participants, showUserSearch } = this.state;
    if (participants && currentUser) {
      const isParticipant = find(participants, (p) => { return (p.fbid === currentUser.fbid); });
      if (isParticipant) {
        if (showUserSearch) {
          return (<div id="usersearch-eventview">
            <UserSearch
              handleUser={this.handleUser}
              currentUser={this.props.currentUser}
              handleParticipants={()=>{}}
              pending={this.state.pending}
              isEventView={true}
            />
          </div>);
        } else {
          return (
            <div id="add-user-btn" onClick={() => this.setState({ showUserSearch: true })}>
              <FontAwesome name="user-plus" size="lg" />
            </div>
          );
        }
      }
    }
    return null;
  }

  render() {
    const { currentUser, params } = this.props;
    const {
      name,
      description,
      greenspaceName,
      lat,
      lng,
      tags,
    } = this.state;

    const renderedTime = this.renderTime();
    const deleteBtn = this.renderDeleteBtn();
    const joinLeaveBtn = this.renderBtn();
    const renderedParticipants = this.renderParticipants();
    const renderedPending = this.renderPending();
    const renderedTags = this.renderTags();
    const renderedAddUser = this.renderAddUserBtn();

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
        {renderedPending}
        {joinLeaveBtn}
        {renderedAddUser}
        {renderedTags}
      </GreenspaceSidebar>
    );
  }
}

EventView.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  getGreenspaceInfo: PropTypes.func,
}

export default withRouter(EventView);

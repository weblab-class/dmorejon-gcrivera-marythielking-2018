import React, { Component } from 'react';
import Services from '../../services';
import ArrowKeysReact from 'arrow-keys-react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';

class UserSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      users: [],
      participants: [],
      update: false,
      pending: props.pending,
    };

    ArrowKeysReact.config({
        up: () => {
          const currentFoc = parseInt(document.activeElement.id);
          if (currentFoc > -1) {
            const nextFoc = currentFoc - 1;
            const elt = this.refs[String(nextFoc)];
            elt.focus();
            if (nextFoc === -1) {
              const end = elt.value.length;
              setTimeout(() => {
                elt.setSelectionRange(0, end);
              }, 0);
            }
          }
        },
        down: () => {
          const currentFoc = parseInt(document.activeElement.id);
          if (currentFoc < this.state.users.length - 1) {
            this.refs[String(currentFoc + 1)].focus();
          }
        }
      });


    this.updateFormVal = this.updateFormVal.bind(this);
    this.renderUsers = this.renderUsers.bind(this);
    this.updateParticipants = this.updateParticipants.bind(this);
    this.renderParticipants = this.renderParticipants.bind(this);
    this.deleteParticipant = this.deleteParticipant.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.createKeyPress = this.createKeyPress.bind(this);
  }

  updateFormVal(event) {
    const currentUser = this.props.currentUser;

    if (!event.target.value) {this.setState({ users: []});}
    Services.user.search(event.target.value).then((res) => {
      let users = res.content;
      if (users.length > 0) {
        users = users.filter((user) => {
          let matches = this.state.participants.filter((participant) => {
            return participant.fbid === user.fbid;
          });
          const moreMatches = this.state.pending.filter((pender) => {
            return pender.fbid === user.fbid
          });
          matches = matches.concat(moreMatches);
          return !(matches.length > 0) && user.fbid !== currentUser.fbid;
        });
      }
      this.setState({ users: users});
    });
  }

  updateParticipants(event, user) {
    const updatedParticipants = this.state.participants.concat(user);
    const updatedPending = this.state.pending.concat(user);
    this.props.handleParticipants(updatedParticipants);
    this.props.handleUser(user);
    this.refs[String(-1)].value = '';
    this.refs[String(-1)].focus();
    this.setState({ participants: updatedParticipants, users: [] });
  }

  deleteParticipant(event, user) {
    let participants = this.state.participants;
    participants = participants.filter((participant) => {
      return participant.fbid !== user.fbid;
    });
    this.refs[String(-1)].focus();
    this.props.handleParticipants(participants);
    this.setState({ participants: participants});
  }

  renderUsers(users) {
    return users.map((user, idx) => {
      return (
        <li
          onKeyPress={((e) => this.handleKeyPress(e, user))}
          tabIndex={idx}
          id={idx.toString()}
          ref={idx.toString()}
          key={user.fbid}
          onClick={((e) => this.updateParticipants(e, user))}
          className="search-results"
        >
          <img src={user.photo} height="30px" className="profile-icon" id="search-icon"/>
          {user.displayname}
        </li>
      );
    });
  }

  renderParticipants(participants) {
    return participants.map((user) => {
      if (this.props.host && this.props.host.fbid == this.props.currentUser.fbid && this.props.isEventView) {
        return null;
      }
      let checkOrTrash = null;
      if (this.props.isEventView) {
        checkOrTrash = <FontAwesome name="check" title="Invited" id="check-participant-icon"/>;
      } else {
        checkOrTrash = <FontAwesome name="trash" title="Delete" id="delete-participant-icon" onClick={((e) => this.deleteParticipant(e, user))}/>;
      }
      return (
        <div key={user.fbid} className="list-item-participant">
          <div className="list-item-participant-pic-text">
            <img src={user.photo} height="30px" className="profile-icon list-item-participant-pic"/>
            {user.displayname}
          </div>
          {checkOrTrash}
          </div>
      );
    });
  }

  handleKeyPress(event, user) {
    if (event.key === 'Enter') {
      this.updateParticipants(event, user)
    }
  }

  createKeyPress(event, user) {
    if (event.key === 'Enter') {
      this.props.create();
    }
  }

  render() {
    const {
      users,
      participants,
    } = this.state;

    let renderedUsers = [];
    let renderedParticipants = [];
    if (users.length > 0) {renderedUsers = this.renderUsers(users);}
    if (participants.length > 0) {
      renderedParticipants = this.renderParticipants(participants);
    }

    return (
      <div>
        {this.props.isEventView ? null : (<div>Invite Users:</div>)}
        <div className="list-items" id="list-items-participant">{renderedParticipants}</div>
        <div className="form" {...ArrowKeysReact.events} tabIndex="-1">
          <input className='form-input' id="-1"
            placeholder='add users'
            onChange={this.updateFormVal}
            onKeyPress={this.createKeyPress}
            ref="-1"
          />
        <div className="list-items" id="list-items-participant">
          <ul className="user-list">{renderedUsers}</ul>
        </div>
        </div>
      </div>
    );
  }
}

UserSearch.propTypes = {
  pending: PropTypes.arrayOf(PropTypes.object),
  isEventView: PropTypes.bool,
  handleParticipants: PropTypes.func,
  handleUser: PropTypes.func,
  host: PropTypes.object,
}

UserSearch.defaultProps = {
  pending: [],
  isEventView: false,
  handleParticipants: () => {},
  handleUser: () => {},
  host: undefined,
}
export default UserSearch;

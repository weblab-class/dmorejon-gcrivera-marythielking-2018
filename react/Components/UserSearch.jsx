import React, { Component } from 'react';
import Services from '../../services';
import ArrowKeysReact from 'arrow-keys-react';
import FontAwesome from 'react-fontawesome';

class UserSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      users: [],
      participants: []
    };

    ArrowKeysReact.config({
        up: () => {
          const currentFoc = parseInt(document.activeElement.id);
          if (currentFoc > -1) {
            this.refs[String(currentFoc - 1)].focus();
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
  }

  updateFormVal(event) {
    if (!event.target.value) {this.setState({ users: []});}
    Services.user.search(event.target.value).then((res) => {
      let users = res.content;
      if (users.length > 0) {
        users = users.filter((user) => {
          let matches = this.state.participants.filter((participant) => {
            return participant.fbid === user.fbid;
          });
          return !(matches.length > 0);
        });
      }
      this.setState({ users: users});
    });
  }

  updateParticipants(event, user) {
    const updatedParticipants = this.state.participants.concat(user);
    this.props.handleParticipants(updatedParticipants);
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
        <div>
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
      </div>
      );
    });
  }

  renderParticipants(participants) {
    return participants.map((user) => {
      return (
        <div key={user.fbid} className="list-item-participant">
          <img src={user.photo} height="30px" className="profile-icon"/>
          {user.displayname}
          <FontAwesome name="trash" title="Delete" id="delete-participant-icon" onClick={((e) => this.deleteParticipant(e, user))}/>
        </div>
      );
    });
  }

  handleKeyPress(event, user) {
    if (event.key === 'Enter') {
      this.updateParticipants(event, user)
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
        <div>Participants:</div>
        <div className="list-items" id="list-items-participant">{renderedParticipants}</div>
        <div className="form" {...ArrowKeysReact.events} tabIndex="-1">
          <input className='form-input' id="-1"
            placeholder='add participants'
            onChange={this.updateFormVal}
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

export default UserSearch;

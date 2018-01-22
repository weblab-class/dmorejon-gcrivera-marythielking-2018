import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Sidebar from '../Components/Sidebar.jsx';
import UserSearch from '../Components/UserSearch.jsx';
import eventServices from '../../services/eventServices.js';

class CreateEvent extends Component {
  constructor(props){
    super(props);
    this.state = {
      gid: props.params.gid,

      nameVal: '',
      descriptionVal: '',
      startVal: '',
      endVal: '',
      participants: [],
    };

    this.updateFormVal = this.updateFormVal.bind(this);
    this.handleParticipants = this.handleParticipants.bind(this);
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

  handleParticipants(participants) {
    this.setState({ participants: participants});
  }

  create() {
    const {
      gid,
      nameVal,
      descriptionVal,
      startVal,
      endVal,
      participants,
    } = this.state;
    const startDate = new Date(this.state.startVal);
    const endDate = new Date(this.state.endVal);

    eventServices.create(nameVal, descriptionVal, gid, startDate, endDate, participants)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        if (err.statusCode == 403) {
          this.props.router.push(`/login/require/${window.location.search}`);
        }
      });
    this.props.router.push(`/map/${gid}/${window.location.search}`);
  }

  render(){
    const {
      nameVal,
      descriptionVal,
      startVal,
      endVal,
      participants,
    } = this.state;

    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <Link to={`/map/${this.props.params.gid}/${window.location.search}`} id="back-button">
          <FontAwesome name="chevron-left" size="2x" id="back-button-icon" />
        </Link>
        <h1 className="section-header">Create Event</h1>
        <div className="form">
          <input className='form-input'
            name='nameVal'
            placeholder='event name'
            value={nameVal}
            onChange={this.updateFormVal}
          />
          <textarea className='form-input textarea'
            name='descriptionVal'
            placeholder='event description'
            value={descriptionVal}
            onChange={this.updateFormVal}
          />
          <div>Start:</div>
          <input className='form-input'
            name='startVal'
            value={startVal}
            type="datetime-local"
            onChange={this.updateFormVal}
          />
          <div>End:</div>
          <input className='form-input'
            name='endVal'
            value={endVal}
            type="datetime-local"
            onChange={this.updateFormVal}
          />
        <UserSearch handleParticipants={this.handleParticipants}/>
          <div className="btn" onClick={this.create}>Create</div>
        </div>
      </Sidebar>
    );
  }
}

CreateEvent.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
}

export default withRouter(CreateEvent);

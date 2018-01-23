import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';

import GreenspaceSidebar from '../Components/GreenspaceSidebar.jsx';
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

      greenspaceName: '',
      lat: 0,
      lng: 0,
    };

    this.updateFormVal = this.updateFormVal.bind(this);
    this.handleParticipants = this.handleParticipants.bind(this);
    this.create = this.create.bind(this);
  }

  componentDidMount() {
    const gid = this.props.params.gid;

    this.props.getGreenspaceInfo(gid, (info) => this.setState(info));
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
        this.props.router.push(`/map/${gid}/${window.location.search}`);
      });
  }

  render(){
    const {
      nameVal,
      descriptionVal,
      startVal,
      endVal,
      participants,
      greenspaceName,
      lat,
      lng,
    } = this.state;

    return (
      <GreenspaceSidebar
        setMapPlaceMarkers={this.props.setMapPlaceMarkers}
        name={greenspaceName}
        lat={lat}
        lng={lng}
        backTo={`/map/${this.props.params.gid}/${window.location.search}`}
      >
        <h1 className="section-header">Create Event</h1>
        <div className="form">
          <input autoFocus className='form-input'
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
      </GreenspaceSidebar>
    );
  }
}

CreateEvent.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  getGreenspaceInfo: PropTypes.func,
}

export default withRouter(CreateEvent);

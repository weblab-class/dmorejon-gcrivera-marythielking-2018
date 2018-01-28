import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';

import GreenspaceSidebar from '../Components/GreenspaceSidebar.jsx';
import UserSearch from '../Components/UserSearch.jsx';
import eventServices from '../../services/eventServices.js';
import greenspaceServices from '../../services/greenspaceServices.js';

class CreateEvent extends Component {
  constructor(props){
    super(props);

    const current = new Date();
    const date = current.toISOString().substring(0,8) + current.getDate();

    const startVal = `${date}T17:00`;
    const endVal = `${date}T18:00`;

    const startDate = new Date(startVal);
    const startValid = (startDate - current > 0);
    const endDate = new Date(endVal);
    const endValid = (endDate - current > 0);

    this.state = {
      gid: props.params.gid,

      nameVal: '',
      descriptionVal: '',
      startVal,
      endVal,
      pending: [],

      nameValid: false,
      startValid,
      endValid,
      errorMessage: null,

      greenspaceName: '',
      lat: 0,
      lng: 0,
    };

    this.updateFormVal = this.updateFormVal.bind(this);
    this.validateFormVal = this.validateFormVal.bind(this);
    this.setEndVal = this.setEndVal.bind(this);
    this.handleParticipants = this.handleParticipants.bind(this);
    this.create = this.create.bind(this);
  }

  componentDidMount() {
    const gid = this.props.params.gid;

    this.props.getGreenspaceInfo(gid, (info) => {
      if (this.refs.component) {
        this.setState(info)
      }
    });
  }

  updateFormVal(event){
    const updatedField = event.target.name;
    const updatedValue = event.target.value;
    this.setState((prevState) => {
      prevState[updatedField] = updatedValue;
      return prevState;
    }, () => this.validateFormVal(updatedField, updatedValue));
  }

  validateFormVal(field, value) {
    var {
      nameValid,
      startValid,
      endValid,
    } = this.state;

    switch(field) {
      case 'nameVal':
        nameValid = (value.length >= 1);
        break;

      case 'startVal':
        const current = new Date();
        const startDate = new Date(value);
        startValid = (startDate - current > 0);
        break;

      case 'endVal':
        const startDateState = new Date(this.state.startVal);
        const endDate = new Date(value);
        endValid = (endDate - startDateState > 0);
        break;

      default:
        break;
    }

    this.setState({ nameValid, startValid, endValid });
    return;
  }

  setEndVal() {
    const {
      startVal,
      startValid,
      endVal,
      endValid,
    } = this.state;
    if (startValid) {
      // don't update the end value if it's valid
      if (endValid) {
        const startDate = new Date(startVal);
        const endDate = new Date(endVal);
        if (endDate - startDate > 0) {
          return;
        }
      }

      const endHour = parseInt(startVal.substring(11,13)) + 1;
      var newEndVal = `${startVal.substring(0,11)}${endHour}${startVal.substring(13)}`

      // set end time to end of day if start time is after 11pm
      if (endHour === 24) {
        newEndVal = `${newEndVal.substring(0,11)}23:59`;
      }

      this.validateFormVal('endVal', newEndVal);
      this.setState({ endVal: newEndVal });
      return;
    }
  }

  handleParticipants(participants) {
    this.setState({ pending: participants});
  }

  create() {
    const {
      gid,
      nameVal,
      descriptionVal,
      startVal,
      endVal,
      pending,
      nameValid,
      startValid,
      endValid,
    } = this.state;

    const startDate = new Date(this.state.startVal);
    const endDate = new Date(this.state.endVal);

    if (!nameValid) {
      this.setState({ errorMessage: 'Please enter a valid event name.', });
    } else if (!startValid) {
      this.setState({ errorMessage: 'Please enter a valid start time.', });
    } else if (!endValid) {
      this.setState({ errorMessage: 'Please enter a valid end time.', });
    } else {
      greenspaceServices.info(gid)
        .then((res) => {
          const greenspace = res.content;
          eventServices.create(nameVal, descriptionVal, greenspace, startDate, endDate, pending)
            .then((res) => {
              this.props.router.push(`/map/${gid}/${window.location.search}`);
            });
        });
    }
  }

  render(){
    const {
      nameVal,
      descriptionVal,
      startVal,
      endVal,
      pending,
      greenspaceName,
      lat,
      lng,
      errorMessage,
    } = this.state;

    return (
      <GreenspaceSidebar
        setMapPlaceMarkers={this.props.setMapPlaceMarkers}
        name={greenspaceName}
        lat={lat}
        lng={lng}
        ref="component"
      >
        <div className="section-header">Create Event</div>
        <div className="form">
          <input autoFocus
            className='form-input'
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
            onBlur={this.setEndVal}
          />
          <div>End:</div>
          <input className='form-input'
            name='endVal'
            value={endVal}
            type="datetime-local"
            onChange={this.updateFormVal}
          />
          <UserSearch
            handleParticipants={this.handleParticipants}
            currentUser={this.props.currentUser}
          />
          <div className="btn" onClick={this.create}>Create</div>
          { errorMessage ? (<div id="form-error">{errorMessage}</div>) : null }
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

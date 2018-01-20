import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Sidebar from '../Components/Sidebar.jsx';
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
    };

    this.updateFormVal = this.updateFormVal.bind(this);
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

  create() {
    const {
      gid,
      nameVal,
      descriptionVal,
      startVal,
      endVal,
    } = this.state;
    const startDate = new Date(this.state.startVal);
    const endDate = new Date(this.state.endVal);

    console.log(typeof startDate);
    
    eventServices.create(nameVal, descriptionVal, gid, startDate, endDate, [])
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err.error.err));
    this.props.router.push(`/map/${gid}/${window.location.search}`);
  }

  render(){
    const {
      nameVal,
      descriptionVal,
      startVal,
      endVal,
    } = this.state;

    return (
      <Sidebar>
        <h1 className="section-header">CreateEvent</h1>
        <div className="form">
          <input className='form-input'
            name='nameVal'
            placeholder='event name'
            value={nameVal}
            onChange={this.updateFormVal}
          />
          <input className='form-input'
            name='descriptionVal'
            placeholder='event description'
            value={descriptionVal}
            onChange={this.updateFormVal}
          />
          <input className='form-input'
            name='startVal'
            value={startVal}
            type="datetime-local"
            onChange={this.updateFormVal}
          />
          <input className='form-input'
            name='endVal'
            value={endVal}
            type="datetime-local"
            onChange={this.updateFormVal}
          />
          <div className="btn" onClick={this.create}>Create</div>
        </div>
      </Sidebar>
    );
  }
}

export default withRouter(CreateEvent);

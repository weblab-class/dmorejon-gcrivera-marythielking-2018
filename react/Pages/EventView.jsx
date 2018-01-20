import React, { Component } from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import eventServices from '../../services/eventServices.js';

class EventView extends Component {
  constructor(props){
    super(props);
    const eventId = props.params.eventId;

    this.state = {};

    eventServices.info(eventId)
      .then((res) => this.setState(res.content))
      .catch((err) => console.log(err));
  }

  render(){
    const {
      name,
      description,
      starttime,
      endtime,
    } = this.state;

    var startDate = '';
    var startHour = '';
    var endDate = '';
    var endHour = '';

    if (starttime && endtime) {
      startDate = starttime.substring(0,10);
      startHour = starttime.substring(11,16);
      endDate = endtime.substring(0,10);
      endHour = endtime.substring(11,16);
    }
    
    return (
      <Sidebar>
        <h1 className="section-header">{name}</h1>
        <div>{description}</div>
        <div>{startDate} {startHour} to {endDate} {endHour}</div>
      </Sidebar>
    );
  }
}

export default EventView;

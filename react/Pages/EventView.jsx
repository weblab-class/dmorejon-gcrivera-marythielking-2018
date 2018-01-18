import React, { Component } from 'react';
import Sidebar from '../Components/Sidebar.jsx';

class EventView extends Component {
  render(){
    return (
      <Sidebar>
        <h1 className="section-header">{this.props.params.id}</h1>
      </Sidebar>
    );
  }
}

export default EventView;

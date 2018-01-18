import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Sidebar from '../Components/Sidebar.jsx';

class GreenspaceInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      lat: props.params.lat,
      lng: props.params.lng,
    };

    this.renderEvent = this.renderEvent.bind(this);
    this.renderStar = this.renderStar.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.params !== this.props.params) {
      this.state.lat = newProps.params.lat;
      this.state.lng = newProps.params.lng;
    }
  }

  renderEvent(e) {
    const { lat, lng } = this.state;
    const { name } = e;
    return (<Link
      to={`/map/${lat},${lng}/event/${name}`}
      className="list-item-event"
      key={name}
    >{name}</Link>);
  }

  renderStar(s) {
    const rating = 3.5;
    if (s < rating) {
      return (<FontAwesome name="star" key={s} />);
    } else if (s - rating === 0.5) {
      return (<FontAwesome name="star-half-o" key={s} />);
    } else {
      return (<FontAwesome name="star-o" key={s} />);
    }
  }

  render(){
    const { lat, lng } = this.state;
    const dummyEvents = [
      { name: "Event 1" },
      { name: "Event 2" },
      { name: "Event 3" },
      { name: "Event 4" },
      { name: "Event 5" },
      { name: "Event 6" },
      { name: "Event 7" },
      { name: "Event 8" },
      { name: "Event 9" },
      { name: "Event 10" },
      { name: "Event 11" },
      { name: "Event 12" },
      { name: "Event 13" },
      { name: "Event 14" },
      { name: "Event 15" },
      { name: "Event 16" },
    ]
    const events = dummyEvents.map((e) => this.renderEvent(e));
    const stars = [1,2,3,4,5].map((s) => this.renderStar(s));

    return (
      <Sidebar>
        <h1>Briggs Field</h1>
        <div className="rating-stars">{stars}</div>
        <div className="list-items">{events}</div>
        <Link to={`/map/${lat},${lng}/event/create`} id="add-event">
          <FontAwesome name="plus-square-o" size="2x" id="add-event-icon" />
          <div id="add-event-text">Create New Event</div>
        </Link>
      </Sidebar>
    );
  }
}

GreenspaceInfo.propTypes = {
}

export default withRouter(GreenspaceInfo);

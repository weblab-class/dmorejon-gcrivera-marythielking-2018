import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';

class EventList extends Component {
  constructor(props){
    super(props);
    this.renderEvent = this.renderEvent.bind(this);
  }

  renderEvent(e) {
    const { name, _id, starttime, greenspace } = e;

    const localStart = new Date(starttime).toString()
    const date = localStart.substring(4,10)
      + ", " + localStart.substring(11,15)
      + " at " + localStart.substring(16,21);

    return (<Link
      to={`/map/${greenspace._id}/event/${_id}/${window.location.search}`}
      className="list-item-event"
      key={_id}
    >
      <div className="event-name">{name}</div>
      <div className="event-date">{date}</div>
    </Link>);
  }

  render(){
    const { events, maxHeight } = this.props;

    if (events.length === 0) {
      return null;
    }
    return (
      <div
        className="list-items"
        style={{ maxHeight }}
      >
        {events.map((e) => this.renderEvent(e))}
      </div>
    );
  }
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  maxHeight: PropTypes.string,
}

EventList.defaultProps = {
  maxHeight: null,
}

export default withRouter(EventList);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';

import Services from '../../services';
import Sidebar from '../Components/Sidebar.jsx';
import EventList from '../Components/EventList.jsx';
import TagSearch from '../Components/TagSearch.jsx';

class Discover extends Component {
  constructor(props){
    super(props);

    this.state = {
      data: null,
      location: null,
      tags: [],
    };

    this.renderData = this.renderData.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.discoverServiceCall = this.discoverServiceCall.bind(this);
  }

  componentDidMount() {
    this.discoverServiceCall();
  }

  discoverServiceCall() {
    if (window.location.search) {
      let location = window.location.search.split('=')[1].split(',');
      location = [parseFloat(location[0]), parseFloat(location[1])];
      this.setState({location: location});
      Services.discover.info(location)
        .then((res) => {
          if (this.refs.component) {
            this.setState({data: res.content});
          }
        });
    }
  }

  renderEvents(events) {
    if (events.length === 0) {
      return (<div id="discover-upcoming-events">There are no upcoming events.</div>);
    }
    return (<div id="discover-upcoming-events">
      <EventList events={events} maxHeight="80px" />
    </div>);
  }

  renderData(data) {
    return data.map((val) => {
      const events = this.renderEvents(val.events);
      return (
        <div key={val.greenspace._id} className="discover-greenspace">
          <div className="discover-greenspace-header">
            <div className="discover-greenspace-name">{val.greenspace.name}</div>
            <Link to={`/map/${val.greenspace._id}/${window.location.search}`}>
              <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" height="20px" title="View Greenspace"/>
            </Link>
          </div>
          <hr className="discover-hr"/>
          {events}
        </div>
      );
    });
  }

  handleAddTag(tags, tag) {
    this.setState({ tags: tags });
    Services.user.addTag(tag.name)
      .then(() => {
        this.discoverServiceCall();
      });
  }

  handleRemoveTag(tags, tag) {
    this.setState({ tags: tags });
    Services.user.deleteTag(tag.name)
      .then(() => {
        this.discoverServiceCall();
      });
  }

  render() {
    const { data, location } = this.state;

    let dataDiv = null;
    if (!location) {
      dataDiv = (
        <div>
          Greenspace needs your location to start discovering!
        </div>
      );
    } else if (data) {
      dataDiv = this.renderData(data);
    }

    return (
      <Sidebar ref="component" setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <h1>Discover</h1>
        <div id="tag-title-discover">Add your tags:</div>
        <TagSearch
          handleAddTag={this.handleAddTag}
          handleRemoveTag={this.handleRemoveTag}
          userTags={this.props.currentUser.tags}
        />
        {dataDiv}
      </Sidebar>
    );
  }
}

Discover.propTypes = {
  setMapPlaceMarkers: PropTypes.func,
  currentUser: PropTypes.object,
}

export default withRouter(Discover);

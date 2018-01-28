import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Services from '../../services'
import Sidebar from '../Components/Sidebar.jsx';

class GreenspaceSidebar extends Component {
  constructor(props){
    super(props);

    this.state = {
      greenspace: null,
      isFavorite: null,
    }

    this.onBackClick = this.onBackClick.bind(this);
    this.toggleStar = this.toggleStar.bind(this);
  }

  componentDidMount() {
    const gid = this.props.params.gid;

    Services.greenspace.info(gid)
      .then((res) => {
        if (this.refs.component) {
          this.setState({greenspace: res.content});
        }
      });
    if(this.props.currentUser) {
      Services.user.isFavorite(gid)
        .then((res) => {
          if (this.refs.component) {
            this.setState({isFavorite: res.content});
          }
        });
    }
  }

  onBackClick() {
    if (this.props.location.pathname.includes('/reviews/')) {
      this.props.router.push(`/map/${this.props.params.gid}/${window.location.search}`);
    } else {
      this.props.router.goBack();
    }
    return;
  }

  toggleStar() {
    if(this.state.isFavorite) {
      Services.user.removeFavorite(this.state.greenspace)
        .then((res) => {
          this.setState({isFavorite: false});
        });
    }
    else {
      Services.user.addFavorite(this.state.greenspace)
        .then((res) => {
          this.setState({isFavorite: true});
      });
    }
  }

  render(){
    const {
      setMapPlaceMarkers,
      name,
      lat,
      lng,
      backButton,
      children,
      router,
      currentUser,
    } = this.props;

    const {
      isFavorite,
    } = this.state;

    let renderedBackButton = null;
    if (backButton) {
      renderedBackButton = (<div id="back-button" onClick={this.onBackClick}>
        <FontAwesome
          name="angle-left"
          size="2x"
          title="Back"
        />
      </div>);
    }

    let renderedStar = (
      <FontAwesome
        name="star-o"
        size="lg"
        id="fav-star-unfilled"
        title="Favorite"
        onClick={this.toggleStar}
      />)
    ;
    if (isFavorite) {
      renderedStar = (
        <FontAwesome
          name="star"
          size="lg"
          id="fav-star-filled"
          title="Unfavorite"
          onClick={this.toggleStar}
        />
      );
    }

    return (
      <Sidebar setMapPlaceMarkers={setMapPlaceMarkers} ref="component">
        { renderedBackButton }
        <div id="greenspace-header">
          <div id="greenspace-name-star">
            <h1>{name}</h1>
            { currentUser ? renderedStar : '' }
          </div>
          <a href={`https://www.google.com/maps?saddr=My+Location&daddr=${lat},${lng}`} target="_blank">
            <img src="/images/google-maps-icon-2015.png" height="30px" className="gmaps-logo" title="Directions"/>
          </a>
        </div>
        { children }
      </Sidebar>
    );
  }
}

GreenspaceSidebar.propTypes = {
  children: PropTypes.any,
  setMapPlaceMarkers: PropTypes.func,
  name: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  backButton: PropTypes.bool,
  currentUser: PropTypes.object,
}

GreenspaceSidebar.defaultProps = {
  backButton: true,
}

export default withRouter(GreenspaceSidebar);

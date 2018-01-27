import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import onClickOutside from 'react-onclickoutside';
import FontAwesome from 'react-fontawesome';

class PopUp extends Component {
  componentDidMount() {
    if (this.props.disableMap) {
      this.props.setMapViewOnly(true);
    }
  }

  componentWillUnmount() {
    this.props.setMapViewOnly(false);
  }

  handleClickOutside(event) {
    if (this.props.canClickOut) {
      this.props.router.push(`/map/${window.location.search}`);
    }
  }

  render(){
    var closeButton = null;
    if (this.props.canClickOut) {
      closeButton = (
        <Link to={`/map/${window.location.search}`} className="close-btn" id="popup-close-btn">
          <FontAwesome name="times" size="lg" title="Close"/>
        </Link>
      );
    }
    return (
      <div className="popup" id={this.props.id}>
        { closeButton }
        {this.props.children}
      </div>
    )
  }
}

PopUp.propTypes = {
  children : PropTypes.any.isRequired,
  id : PropTypes.string,
  disableMap: PropTypes.bool,
  setMapViewOnly: PropTypes.func,
  canClickOut: PropTypes.bool,
};

PopUp.defaultProps = {
  disableMap: true,
  canClickOut: true,
}

export default withRouter(onClickOutside(PopUp));

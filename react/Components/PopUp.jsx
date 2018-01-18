import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import onClickOutside from 'react-onclickoutside';

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
    this.props.router.push(`/map`);
  }

  render(){
    return (
      <div className="popup" id={this.props.id}>
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
};

PopUp.defaultProps = {
  disableMap: true,
}

export default withRouter(onClickOutside(PopUp));

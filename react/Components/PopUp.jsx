import React, { Component } from 'react';

class PopUp extends Component {

  render(){
    return (
      <div id="popup">
        {this.props.children}
      </div>
    )
  }
}

PopUp.propTypes = {
  children : React.PropTypes.any.isRequired
};

export default PopUp;

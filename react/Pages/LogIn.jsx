import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../Components/PopUp.jsx';

class LogIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
    };

    this.updateFormVal = this.updateFormVal.bind(this);
    this.logInUser = this.logInUser.bind(this);
  }

  updateFormVal(event){
    const updatedField = event.target.name;
    const updatedValue = event.target.value;
    this.setState((prevState) => {
      prevState[updatedField] = updatedValue;
      return prevState;
    });
  }

  logInUser() {
    const {
      username,
      email,
    } = this.state;
    this.props.logInUser(username, email);
  }

  render(){
    const {
      username,
      email,
    } = this.state;

    return (
      <PopUp setMapViewOnly={this.props.setMapViewOnly}>
        <h1 className="section-header">Welcome to Greenspace!</h1>
        <div className="form">
          <input className='form-input'
            name='username'
            placeholder='username'
            value={username}
            onChange={this.updateFormVal}
          />
          <input className='form-input'
            name='email'
            placeholder='email'
            value={email}
            onChange={this.updateFormVal}
          />
          <a
            href="/auth/facebook"
            className="fb-btn btn"
            onClick={this.logInUser}
          >
            <img src="images/FB-f-Logo__white_1024.png" height="20px" className="fb-logo" />
            Log in with Facebook
          </a>
        </div>
      </PopUp>
    );
  }
}

LogIn.propTypes = {
  logInUser: PropTypes.func,
  setMapViewOnly: PropTypes.func,
}

export default LogIn;

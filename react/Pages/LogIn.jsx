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
    this.loginUser = this.loginUser.bind(this);
  }

  updateFormVal(event){
    const updatedField = event.target.name;
    const updatedValue = event.target.value;
    this.setState((prevState) => {
      prevState[updatedField] = updatedValue;
      return prevState;
    });
  }

  loginUser() {
    const {
      username,
      email,
    } = this.state;
    this.props.loginUser(username, email);
  }

  render(){
    const {
      username,
      email,
    } = this.state;

    return (
      <PopUp>
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
          <div className="fb-btn btn" onClick={this.loginUser}>Continue with Facebook</div>
        </div>
      </PopUp>
    );
  }
}

LogIn.propTypes = {
  loginUser: PropTypes.func,
}

export default LogIn;

// <div
//   className="fb-login-button"
//   data-max-rows="1" data-size="large"
//   data-button-type="continue_with"
//   data-show-faces="false"
//   data-auto-logout-link="false"
//   data-use-continue-as="false"
// ></div>

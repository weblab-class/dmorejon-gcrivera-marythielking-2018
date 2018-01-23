import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Components/Sidebar.jsx';

class CreateGreenspace extends Component {
  constructor(props){
    super(props);
    this.state = {
      lat: props.params.lat,
      lng: props.params.lng,

      nameVal: '',
    };

    this.updateFormVal = this.updateFormVal.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.create = this.create.bind(this);
  }

  updateFormVal(event){
    const updatedField = event.target.name;
    const updatedValue = event.target.value;
    this.setState((prevState) => {
      prevState[updatedField] = updatedValue;
      return prevState;
    });
  }

  onKeyPress(e){
    if(e.which === 13) {
      this.create();
    }
  }

  create() {
    const { lat, lng, nameVal } = this.state;
    this.props.createGreenspace(nameVal, lat, lng);
  }

  render(){
    const { nameVal } = this.state;

    return (
      <Sidebar setMapPlaceMarkers={this.props.setMapPlaceMarkers}>
        <h1>Create Greenspace</h1>
        <div className="form">
          <input autoFocus className='form-input'
            name='nameVal'
            placeholder='greenspace name'
            value={nameVal}
            onChange={this.updateFormVal}
            onKeyPress={this.onKeyPress}
          />
          <div className="btn" onClick={this.create}>Create</div>
        </div>
      </Sidebar>
    );
  }
}

CreateGreenspace.propTypes = {
  createGreenspace: PropTypes.func,
  setMapPlaceMarkers: PropTypes.func,
}

export default CreateGreenspace;

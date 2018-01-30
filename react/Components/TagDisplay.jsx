import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TagDisplay extends Component {
  constructor(props){
    super(props);

    let propTagObjects = props.propTags.map((tagString) => {
      return { name: tagString };
    });

    this.state = {
      tags: propTagObjects,
    };

    this.renderTags = this.renderTags.bind(this);
  }

  // componentWillReceiveProps(newProps) {
  //   if(newProps.propTags && newProps.updateState) {
  //     let propTagObjects = newProps.propTags.map((tagString) => {
  //       return { name: tagString };
  //     });
  //     this.setState({ tags: propTagObjects });
  //   }
  // }

  renderTags(tags) {
    return tags.map((tag, idx) => {
      return (
        <div key={tag.name} className="list-item-tag">
          {tag.name}
        </div>
      );
    });
  }

  render() {
    const {
      tags,
    } = this.state;

    let renderedTags = [];
    let renderedAddedTags = [];
    if (tags.length > 0) {renderedTags = this.renderTags(tags);}
    else {renderedTags = "No tags to display!"}

    return (
        <div className="list-items" id="list-items-addedTag">{renderedTags}</div>
    );
  }
}

TagDisplay.propTypes = {
  propTags: PropTypes.arrayOf(PropTypes.string),
  updateState: PropTypes.bool,
}

TagDisplay.defaultProps = {
  propTags: [],
}

export default TagDisplay;

import React, { Component } from 'react';
import Services from '../../services';
import PropTypes from 'prop-types';
import ArrowKeysReact from 'arrow-keys-react';
import FontAwesome from 'react-fontawesome';

class TagSearch extends Component {
  constructor(props){
    super(props);
    let propTagObjects = props.propTags.map((tagString) => {
      return { name: tagString };
    });
    this.state = {
      tags: [],
      addedTags: propTagObjects,
      userAddedTags: [],
      createdTags: [],
      isNew: null,
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateTagList = this.updateTagList.bind(this);
    this.updateFormVal = this.updateFormVal.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.removeFromArray = this.removeFromArray.bind(this);
    this.renderSearchTags = this.renderSearchTags.bind(this);
    this.renderAddedTags = this.renderAddedTags.bind(this);
    this.keyScroll = this.keyScroll.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.propTags && newProps.updateState) {
      let propTagObjects = newProps.propTags.map((tagString) => {
        return { name: tagString };
      });
      this.setState({ addedTags: propTagObjects });
    }
  }

  handleKeyPress(event, tag) {
    if (event.key === 'Enter' && tag !== '') {
      this.updateTagList(event, tag);
    }
  }

  updateTagList(event, tag) {
    const updatedTagList = this.state.addedTags.concat({ name: tag });
    const updatedUserAddedTagList = this.state.userAddedTags.concat({ name: tag });
    if (this.state.isNew) {
      Services.tag.create(tag);
      const updatedCreatedList = this.state.createdTags.concat({ name: tag });
      this.setState({ createdTags: updatedCreatedList });
    }
    this.props.handleAddTag(updatedTagList, { name: tag });
    this.refs[String(-1) + '/tag'].value = '';
    this.refs[String(-1) + '/tag'].focus();
    this.setState({
       addedTags: updatedTagList,
       tags: [],
       isNew: null,
       userAddedTags: updatedUserAddedTagList,
     });
  }

  removeTag(event, tag) {
    const isCreatedTag = this.state.createdTags.some((tagElem) => {
      return tag.name === tagElem.name;
    });
    if (isCreatedTag) {
      Services.tag.delete(tag.name);
      let createdTags = this.removeFromArray(this.state.createdTags, tag);
      this.setState({ createdTags: createdTags });
    }
    let updatedTagList = this.removeFromArray(this.state.addedTags, tag);
    let updatedUserAddedTagList = this.removeFromArray(this.state.userAddedTags, tag);
    this.refs[String(-1) + '/tag'].focus();
    this.props.handleRemoveTag(updatedTagList, tag);
    this.setState({ addedTags: updatedTagList, userAddedTags: updatedUserAddedTagList });
  }

  removeFromArray(array, tag) {
    return array.filter((badTag) => {
      return badTag.name !== tag.name;
    });
  }

  updateFormVal(event) {
    if (!event.target.value) {
      this.setState({ tags: []});
      return;
    }
    Services.tag.search(event.target.value).then((res) => {
      let tagsResults = res.content;
      if (tagsResults.length > 0) {
        this.setState({ isNew: false });
        tagsResults = tagsResults.filter((tag) => {
          let matches = this.state.addedTags.filter((currentTag) => {
            return currentTag.name === tag.name;
          });
          return !(matches.length > 0);
        });
      } else {
        this.setState({ isNew: true })
      }
      this.setState({ tags: tagsResults });
    });
  }

  renderSearchTags(tags) {
    return tags.map((tag, idx) => {
      return (
        <li
          onKeyPress={((e) => this.handleKeyPress(e, tag.name))}
          tabIndex={idx + 1001}
          id={idx.toString() + '/tag'}
          ref={idx.toString() + '/tag'}
          key={tag.name}
          onClick={((e) => this.updateTagList(e, tag.name))}
          className="search-results"
        >
          {tag.name}
        </li>
      );
    });
  }

  renderAddedTags(addedTags) {
    return addedTags.map((tag, idx) => {
      const userCreatedTag = this.state.createdTags.some((cTag) => {
        return cTag.name === tag.name;
      });
      const userAddedTag = this.state.userAddedTags.some((uTag) => {
        return uTag.name === tag.name;
      });
      return (
        <div key={tag.name} className="list-item-tag">
          {tag.name}
          {userCreatedTag || userAddedTag ?
            <FontAwesome name="times" title="Delete" id="delete-tag-icon"
            onClick={((e) => this.removeTag(e, tag))}/>
            : ''}
        </div>
      );
    });
  }

  keyScroll(e) {
    if (e.which == 38) {
      const currentFoc = parseInt(document.activeElement.id.split('/')[0]);
      if (currentFoc > -1) {
        const nextFoc = currentFoc - 1;
        const elt = this.refs[String(nextFoc) + '/tag'];
        elt.focus();
        if (nextFoc === -1) {
          const end = elt.value.length;
          setTimeout(() => {
            elt.setSelectionRange(0, end);
          }, 0);
        }
      }
    }

    if (e.which == 40) {
      const currentFoc = parseInt(document.activeElement.id.split('/')[0]);
      if (currentFoc < this.state.tags.length - 1) {
        this.refs[String(currentFoc + 1) + '/tag'].focus();
      }
    }
  }

  render() {
    const {
      addedTags,
      tags,
    } = this.state;

    let renderedTags = [];
    let renderedAddedTags = [];
    if (tags.length > 0) {renderedTags = this.renderSearchTags(tags);}
    if (addedTags.length > 0) {renderedAddedTags = this.renderAddedTags(addedTags);}

    return (
      <div>
        <div className="list-items" id="list-items-addedTag">{renderedAddedTags}</div>
        <div className="form" onKeyDown={this.keyScroll} tabIndex="1000">
          <input className='form-input' id="-1/tag"
            placeholder='add tags'
            onChange={this.updateFormVal}
            onKeyPress={((e) => this.handleKeyPress(e, e.target.value))}
            ref="-1/tag"
          />
        <div className="list-items" id="list-items-tag">
          <ul className="tag-list">{renderedTags}</ul>
        </div>
        </div>
      </div>
    );
  }
}

TagSearch.propTypes = {
  propTags: PropTypes.arrayOf(PropTypes.string),
  updateState: PropTypes.bool,
}

TagSearch.defaultProps = {
  propTags: [],
  updateState: false,
}

export default TagSearch;

import React, { PropTypes } from 'react';
import { Button } from 'reactstrap';
import styles from './styles.css';


export default class TagSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags,
      addedTags: [],
    };
    console.log(this);
    console.log(this.props.tags);
    // For a full list of possible configurations,
    // please consult http://www.dropzonejs.com/#configuration
  }
  addTag(index) {
    this.setState({
      tags:
        this.state.tags.slice(0, index)
        .concat(this.state.tags.slice(index + 1)),
      addedTags: this.state.addedTags.concat(this.state.tags[index]),
    });
  }
  removeTag(index) {
    this.setState({
      addedTags:
        this.state.addedTags.slice(0, index)
        .concat(this.state.addedTags.slice(index + 1)),
      tags: this.state.tags.concat(this.state.addedTags[index]),
    });
  }
  render() {
    return (
      <div>
        <div className={styles.selectTags}>
          <h4> Select Tags </h4>
          {this.state.tags.map((tag, index) => (
            <Button key={index} size="sm" color="secondary" onClick={() => this.addTag(index)}>
            + {tag.displayName}
            </Button>
          ))}
        </div>
        <div className={styles.selectedTags}>
          <h4> Select Tags </h4>
          {this.state.addedTags.map((tag, index) => (
            <Button key={index} size="sm" color="secondary" onClick={() => this.removeTag(index)}>
            - {tag.displayName}
            </Button>
          ))}
        </div>
        <div className={styles.buttons}>
          <Button size="sm" color="success"> Save All </Button>
          <Button size="sm" color="danger"> Cancel All </Button>
        </div>
      </div>
    );
  }
}

TagSelector.defaultProps = {
  tags: [],
};

TagSelector.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
};

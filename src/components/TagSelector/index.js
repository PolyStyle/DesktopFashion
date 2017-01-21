import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody } from 'reactstrap';
import styles from './styles.css';


class TagSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags,
      addedTags: [],
      isTagModalOpen: false,
    };
    // For a full list of possible configurations,
    // please consult http://www.dropzonejs.com/#configuration
    this.onSaveAll = this.onSaveAll.bind(this);
    this.onCancelAll = this.onCancelAll.bind(this);
    this.toggleTagModal = this.toggleTagModal.bind(this);
  }

  onSaveAll() {
    if (this.props.onSaveAllHandler) {
      this.props.onSaveAllHandler(this.state.addedTags);
    }
  }

  onCancelAll() {
    if (this.props.onCancelAllHandler) {
      this.props.onCancelAllHandler(this.state.addedTags);
    }
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

  toggleTagModal() {
    if (this.state.isTagModalOpen) {
      // Modal is Open
      this.setState({
        isTagModalOpen: false,
      });
    } else {
      this.setState({
        isTagModalOpen: true,
        tags: this.props.tags,
        addedTags: [],
      });
    }
  }

  render() {
    return (
      <div>
        <Button size="sm" color="success" onClick={this.toggleTagModal}> Add Tag </Button>
        <Modal
          className={styles.bigModal}
          isOpen={this.state.isTagModalOpen}
          toggle={this.toggleTagModal}
        >
          <ModalBody>
            <div className={styles.selectTags}>
              <h5> Select Tags </h5>
              {this.state.tags.map((tag, index) => (
                <Button key={index} size="sm" color="secondary" onClick={() => this.addTag(index)}>
                + {tag.displayName}
                </Button>
              ))}
            </div>
            <div className={styles.selectedTags}>
              <h5> Select Tags </h5>
              {this.state.addedTags.map((tag, index) => (
                <Button key={index} size="sm" color="primary" onClick={() => this.removeTag(index)}>
                - {tag.displayName}
                </Button>
              ))}
            </div>
            <div className={styles.buttons}>
              <Button size="sm" color="success" onClick={this.onSaveAll}> Save All </Button>
              <Button size="sm" color="danger" onClick={this.toggleTagModal}> Cancel All </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

TagSelector.defaultProps = {
  tags: [],
};

TagSelector.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  onSaveAllHandler: PropTypes.func,
  onCancelAllHandler: PropTypes.func,
};

const mapStateToProps = state => ({ tags: state.get('tags').tags });

export default connect(mapStateToProps)(TagSelector);

import React, { PropTypes } from 'react';
import { Button, Input, Badge } from 'reactstrap';

class TagComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isEdited: false,
      value: props.tag.displayName,
      index: props.index,
      id: props.tag.id,
      tempValue: props.tag.displayName,
      isDeleting: false,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAttemptDelete = this.handleAttemptDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.tag.id,
    });
  }

  // GOOD: toggle this.state.isActive on click
  handleEdit() {
    this.setState({ isEdited: true });
  }

  handleChange(event) {
    this.setState({ tempValue: event.target.value });
  }

  handleSave(event) {
    console.log(event.target.value);
    this.setState({
      value: this.state.tempValue,
      isEdited: false,
    }, this.props.saveHandler(this.state));
  }
  handleCancel() {
    this.setState({
      isEdited: false,
      isDeleting: false,
    });
  }
  handleAttemptDelete() {
    this.setState({
      isDeleting: true,
    });
  }

  handleDelete() {
    this.props.deleteHandler(this.state);
  }

  render() {
    // use the classSet addon to concat an array of class names together
    return (
      <tr>
        <th scope="row">{this.props.tag.id || <Badge color="default" pill>new</Badge>}</th>
        <td>
          {!this.state.isEdited && this.state.value}
          {this.state.isEdited &&
            <Input type="text" placeholder={this.state.value} value={this.state.tempValue} onChange={this.handleChange} />}
        </td>
        <td>
          {!this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleEdit} color="primary" size="sm">Edit</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleCancel} color="secondary" size="sm">Cancel</Button>}
          {!this.state.isEdited && !this.props.tag.id && <Button onClick={this.handleSave} color="success" size="sm">Save</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleSave} color="success" size="sm">Save</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleAttemptDelete} color="danger" size="sm">Delete</Button>}
          {this.state.isDeleting && <Button onClick={this.handleCancel} color="warning" size="sm"> Cancel </Button>}
          {this.state.isDeleting && <Button onClick={this.handleDelete} color="danger" size="sm">Ok Delete</Button>}
        </td>
      </tr>
    );
  }
}

TagComponent.propTypes = {
  tag: PropTypes.shape({
    id: PropTypes.number,
    displayName: PropTypes.string,
  }),
  index: PropTypes.number,
  saveHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
};

export default TagComponent;

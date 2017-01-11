import React, { PropTypes } from 'react';
import { Button, Input, Badge } from 'reactstrap';
import styles from './styles.css';

class BrandComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isEdited: false,
      brand: {
        ...props.brand,
        tempValues: {
          ...props.brand,
        },
        index: props.index,
      },
      index: props.index,
      isDeleting: false,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAttemptDelete = this.handleAttemptDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeepEdit = this.handleDeepEdit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
      brand: {
        ...nextProps.brand,
        tempValues: nextProps.brand,
        index: nextProps.index,
      },
      index: nextProps.index,
    });
  }

  // GOOD: toggle this.state.isActive on click
  handleEdit() {
    this.setState({
      ...this.state,
      isEdited: true,
    });
    console.log(this.state);
  }

  handleChange(event) {
    this.setState({
      brand: {
        ...this.state.brand,
        index: this.props.index,
        tempValues: {
          ...this.state.brand.tempValues,
          [event.target.name]: event.target.value,
        },
      },
    });
  }

  handleSave() {
    this.setState({
      ...this.state,
      isEdited: false,
      isDeleting: false,
    });
    this.props.saveHandler(this.state.brand);
  }
  handleCancel() {
    this.setState({
      ...this.state,
      isEdited: false,
      isDeleting: false,
    });
  }
  handleAttemptDelete() {
    this.setState({
      ...this.state,
      isDeleting: true,
    });
  }

  handleDelete() {
    this.props.deleteHandler(this.state.brand);
  }

  handleDeepEdit() {
    this.props.deepEditHandler(this.state.brand);
  }

  render() {
    // use the classSet addon to concat an array of class names together
    return (
      <tr>
        <th scope="row">{this.props.brand.id || <Badge color="default" pill>new</Badge>}</th>
        <td>
          <img className={styles.avatarSmall} src={this.props.brand.picture} alt="Brand Logo" />
        </td>
        <td>
          {!this.state.isEdited && this.state.brand.displayName}
          {this.state.isEdited &&
            <Input
              name="displayName"
              type="text"
              size="sm"
              placeholder={this.state.brand.displayName}
              value={this.state.brand.tempValues.displayName}
              onChange={this.handleChange}
            />}
        </td>
        <td>
          {!this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleDeepEdit} color="info" size="sm">Edit</Button>}
          {!this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleEdit} color="primary" size="sm">Quick Edit</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleCancel} color="secondary" size="sm">Cancel</Button>}
          {!this.state.isEdited && !this.props.brand.id && <Button onClick={this.handleSave} color="success" size="sm">Save</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleSave} color="success" size="sm">Save</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleAttemptDelete} color="danger" size="sm">Delete</Button>}
          {this.state.isDeleting && <Button onClick={this.handleCancel} color="warning" size="sm"> Cancel </Button>}
          {this.state.isDeleting && <Button onClick={this.handleDelete} color="danger" size="sm">Ok Delete</Button>}
        </td>
      </tr>
    );
  }
}

BrandComponent.propTypes = {
  brand: PropTypes.shape({
    id: PropTypes.number,
    displayName: PropTypes.string,
    picture: PropTypes.string,
  }),
  index: PropTypes.number,
  saveHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
  deepEditHandler: PropTypes.func,
};

export default BrandComponent;

import React, { PropTypes } from 'react';
import { Button, Input, Badge } from 'reactstrap';
import SelectBrandComponent from './../Brands/selectBrandComponent';
import styles from './styles.css';


class ProductComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdownBrandOpen: false,
      isEdited: false,
      product: {
        ...props.product,
        tempValues: {
          ...props.product,
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
    this.toggleBrandDropDown = this.toggleBrandDropDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
      product: {
        ...nextProps.product,
        tempValues: nextProps.product,
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
    console.log('----state from component- ---');
    console.log(this.state.product.Tags);
    console.log(this.props.product.Tags);
  }

  handleChange(event) {
    this.setState({
      product: {
        ...this.state.product,
        index: this.props.index,
        tempValues: {
          ...this.state.product.tempValues,
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
    this.props.saveHandler(this.state.product);
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
    this.props.deleteHandler(this.state.product);
  }

  handleDeepEdit() {
    this.props.deepEditHandler(this.state.product);
  }

  toggleBrandDropDown() {
    this.setState({
      dropdownBrandOpen: !this.state.dropdownBrandOpen,
    });
  }


  render() {
    // use the classSet addon to concat an array of class names together
    return (
      <tr>
        <th scope="row">{this.props.product.id || <Badge color="default" pill>new</Badge>}</th>
        <td>
          <img className={styles.avatarTable} src={this.props.product.picture} alt="Product Logo" />
        </td>
        <td>
          {!this.state.isEdited && this.props.product.Brand.displayName}
          {this.state.isEdited &&
            <SelectBrandComponent
              brands={this.props.brands}
              selectedItem={this.props.product.Brand}
            />
          }
        </td>
        <td>
          {!this.state.isEdited && this.state.product.Tags.map((tag, index) => (
            <span key={index} className={styles.tagLabel}>{tag.displayName}</span>
          ))}
          {this.state.isEdited && this.state.product.Tags.map((tag, index) => (
            <span key={index} className={styles.tagLabelEdit}>x {tag.displayName}</span>
          ))}
          {this.state.isEdited && <span className={styles.tagLabelAdd}> Add Tag </span>}
        </td>
        <td>
          {!this.state.isEdited && this.state.product.displayName}
          {this.state.isEdited &&
            <Input
              name="displayName"
              type="text"
              size="sm"
              placeholder={this.state.product.displayName}
              value={this.state.product.tempValues.displayName}
              onChange={this.handleChange}
            />}
        </td>
        <td>
          {!this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleDeepEdit} color="info" size="sm">Edit</Button>}
          {!this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleEdit} color="primary" size="sm">Quick Edit</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleCancel} color="secondary" size="sm">Cancel</Button>}
          {!this.state.isEdited && !this.props.product.id && <Button onClick={this.handleSave} color="success" size="sm">Save</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleSave} color="success" size="sm">Save</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleAttemptDelete} color="danger" size="sm">Delete</Button>}
          {this.state.isDeleting && <Button onClick={this.handleCancel} color="warning" size="sm"> Cancel </Button>}
          {this.state.isDeleting && <Button onClick={this.handleDelete} color="danger" size="sm">Ok Delete</Button>}
        </td>
      </tr>
    );
  }
}

ProductComponent.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    displayName: PropTypes.string,
    picture: PropTypes.string,
    Brand: PropTypes.object,
    Tags: PropTypes.arrayOf(PropTypes.object),
  }),
  index: PropTypes.number,
  saveHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
  deepEditHandler: PropTypes.func,
  brands: PropTypes.arrayOf(PropTypes.object),
  // tags: PropTypes.arrayOf(PropTypes.object),
};

export default ProductComponent;

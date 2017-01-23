import React, { PropTypes } from 'react';
import { Button, Input, Badge } from 'reactstrap';
import ScaledImage from './../../components/ScaledImage';
import styles from './styles.css';


class PostComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdownBrandOpen: false,
      isEdited: false,
      post: {
        ...props.post,
        tempValues: {
          ...props.post,
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
    this.changeCurrentBrand = this.changeCurrentBrand.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
      post: {
        ...nextProps.post,
        tempValues: nextProps.post,
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
  }

  handleChange(event) {
    this.setState({
      post: {
        ...this.state.post,
        index: this.props.index,
        tempValues: {
          ...this.state.post.tempValues,
          [event.target.name]: event.target.value,
        },
      },
    });
  }

  changeCurrentBrand(brand) {
    this.setState({
      post: {
        ...this.state.post,
        tempValues: {
          ...this.state.post.tempValues,
          Brand: brand,
        },
      },
    });
  }

  removeTag(index) {
    this.setState({
      post: {
        ...this.state.post,
        tempValues: {
          ...this.state.post.tempValues,
          Tags: this.state.post.tempValues.Tags.slice(0, index)
            .concat(this.state.post.tempValues.Tags.slice(index + 1)),
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
    this.props.saveHandler(this.state.post);
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
    this.props.deleteHandler(this.state.post);
  }

  handleDeepEdit() {
    this.props.deepEditHandler(this.state.post);
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
        <th scope="row">{this.props.post.id || <Badge color="default" pill>new</Badge>}</th>
        <td>
          <ScaledImage styles={styles.postImage} id={this.props.post.ImageId} />
        </td>
        <td className={styles.tdStyle}>
          Brands: <br />
          {this.state.post.Brands.map((brand, index) => (
            <span key={index} className={styles.tagLabel}>{brand.displayName}</span>
          ))}
        </td>
        <td className={styles.tdStyle}>
          Tags: <br />
          {this.state.post.Tags.map((tag, index) => (
            <span key={index} className={styles.tagLabel}>{tag.displayName}</span>
          ))}
          {this.state.isEdited && <Button size="sm" color="primary" className={styles.tagLabelAdd}> Add Tag </Button>}
        </td>
        <td className={styles.tdStyle}>
          Products:
          <br />
          {this.state.post.Products.map((product, index) => (
            <ScaledImage key={index} styles={styles.productImage} id={product.ImageId} />
          ))}
        </td>
        <td className={styles.tdStyle}>
          {!this.state.isEdited && this.state.post.description}
          {this.state.isEdited &&
            <Input
              name="description"
              type="text"
              size="sm"
              placeholder={this.state.post.description}
              value={this.state.post.tempValues.description}
              onChange={this.handleChange}
            />}
        </td>
        <td>
          {!this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleDeepEdit} color="primary" size="sm">Edit</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleCancel} color="secondary" size="sm">Cancel</Button>}
          {!this.state.isEdited && !this.props.post.id && <Button onClick={this.handleSave} color="success" size="sm">Save</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleSave} color="success" size="sm">Save</Button>}
          {this.state.isEdited && !this.state.isDeleting && <Button onClick={this.handleAttemptDelete} color="danger" size="sm">Delete</Button>}
          {this.state.isDeleting && <Button onClick={this.handleCancel} color="warning" size="sm"> Cancel </Button>}
          {this.state.isDeleting && <Button onClick={this.handleDelete} color="danger" size="sm">Ok Delete</Button>}
        </td>
      </tr>
    );
  }
}

PostComponent.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    displayName: PropTypes.string,
    picture: PropTypes.string,
    Brand: PropTypes.object,
    ImageId: PropTypes.number,
    Tags: PropTypes.arrayOf(PropTypes.object),
  }),
  index: PropTypes.number,
  saveHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
  deepEditHandler: PropTypes.func,
  // tags: PropTypes.arrayOf(PropTypes.object),
};

export default PostComponent;

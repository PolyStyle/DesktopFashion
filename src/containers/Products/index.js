import React, { Component, PropTypes } from 'react';
import { Table, Button, Breadcrumb, BreadcrumbItem, Card, CardBlock,
  Input, Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import ProductComponent from './productComponent';
import * as action from './action';
import * as actionTags from './../Tags/action';
import styles from './styles.css';

class Products extends Component {
  // Fetching data method for both server/client side rendering
  static fetchData(dispatch) {
    return Promise.all([
      dispatch(action.fetchDataIfNeeded()),
      dispatch(actionTags.fetchDataIfNeeded()),
    ]);
  }
  static addProduct(dispatch) {
    return Promise.all([
      dispatch(action.addProduct()),
    ]);
  }
  static removeProduct(dispatch, index) {
    return Promise.all([
      dispatch(action.removeProduct(index)),
    ]);
  }
  static deleteProduct(dispatch, id, index) {
    return Promise.all([
      dispatch(action.deleteProduct(id, index)),
    ]);
  }

  static updateProduct(dispatch, value) {
    return Promise.all([
      dispatch(action.updateProduct(value)),
    ]);
  }
  static createProduct(dispatch, index, value) {
    // the index is the position in the current tags redux. Not the id on db.
    return Promise.all([
      dispatch(action.createProduct(index, value)),
    ]);
  }
  constructor() {
    super();
    this.state = {
      isTagModalOpen: false,
      isEdited: false,
      isPictureInModalExpanded: false,
    };
    this.addProductHandler = this.addProductHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.deepEditHandler = this.deepEditHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.saveDetailedHandler = this.saveDetailedHandler.bind(this);
    this.expandPictureInModal = this.expandPictureInModal.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.addTag = this.addTag.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleTagModal = this.toggleTagModal.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    // Fetching data for client side rendering
    Products.fetchData(dispatch, params);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isEdited) {
      const id = this.state.currentProduct.id;
      let product = null;
      let i = 0;
      for (; i < nextProps.products.length; i += 1) {
        if (nextProps.products[i].id === id) {
          product = nextProps.products[i];
        }
      }
      if (!product) {
        return;
      }

      this.setState({
        currentProduct: {
          ...product,
          tempValues: product,
        },
      });
    }
  }

  addProductHandler() {
    const { dispatch } = this.props;
    Products.addProduct(dispatch);
  }

  saveHandler(product) {
    const { dispatch } = this.props;
    const newValue = product.tempValues;
    const id = product.id;
    if (id) {
      // This is an existing tag, just update it.
      Products.updateProduct(dispatch, newValue);
    } else {
      // This is a new tag, create it.
      Products.createProduct(dispatch, product.index, newValue);
    }
  }

  saveDetailedHandler() {
    const { dispatch } = this.props;
    const newProduct = this.state.currentProduct.tempValues;
    const id = newProduct.id;
    const index = newProduct.index;
    console.log('-------');
    console.log(index);
    console.log('-------');
    if (id) {
      // This is an existing Product, just update it.
      Products.updateProduct(dispatch, newProduct);
    } else {
      // This is a new Product, create it.
      Products.createProduct(dispatch, index, newProduct);
    }
    this.setState({
      isEdited: !this.state.isEdited,
    });
  }

  deleteHandler(product) {
    const { dispatch } = this.props;
    const id = product.id;
    if (id) {
      // This is an existing tag, just update it.
      Products.deleteProduct(dispatch, id, product.index);
    } else {
      // This is a new tag, create it.
      console.log('trying to remove Product with index', product.index);
      Products.removeProduct(dispatch, product.index);
    }
  }

  deepEditHandler(product) {
    this.setState({
      isEdited: true,
      currentProduct: {
        ...product,
        tempValues: product,
      },
    });
  }

  handleChange(event) {
    this.setState({
      currentProduct: {
        ...this.state.currentProduct,
        tempValues: {
          ...this.state.currentProduct.tempValues,
          [event.target.name]: event.target.value,
        },
      },
    });
  }

  handleCancel() {
    this.setState({
      isEdited: false,
    });
  }

  toggleEditModal() {
    this.setState({
      isEdited: !this.state.isEdited,
    });
  }
  toggleTagModal() {
    this.setState({
      isTagModalOpen: !this.state.isTagModalOpen,
    });
  }

  expandPictureInModal() {
    console.log(this.state.isPictureInModalExpanded);
    this.setState({
      isPictureInModalExpanded: !this.state.isPictureInModalExpanded,
    });
  }

  removeTag(index) {
    console.log('REMOVE TAG', index);
    console.log(this.state.currentProduct);
    this.setState({
      currentProduct: {
        ...this.state.currentProduct,
        tempValues: {
          ...this.state.currentProduct.tempValues,
          Tags: this.state.currentProduct.tempValues.Tags.slice(0, index)
            .concat(this.state.currentProduct.tempValues.Tags.slice(index + 1)),
        },
      },
    });
  }

  addTag(tag) {
    console.log('attempt to add tag ', tag);
    let found = false;
    // check if tag exists already
    for (let i = 0; i < this.state.currentProduct.tempValues.Tags.length; i += 1) {
      if (this.state.currentProduct.tempValues.Tags[i].id === tag.id) {
        found = true;
      }
    }
    if (!found) {
      this.setState({
        currentProduct: {
          ...this.state.currentProduct,
          tempValues: {
            ...this.state.currentProduct.tempValues,
            Tags: this.state.currentProduct.tempValues.Tags.concat([tag]),
          },
        },
      });
    }
  }
  render() {
    if (this.props.products) {
      return (
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Products</BreadcrumbItem>
            <BreadcrumbItem active>
              <Button color="success" onClick={this.addProductHandler} size="sm">Add Product</Button>
            </BreadcrumbItem>
          </Breadcrumb>
          <Modal isOpen={this.state.isEdited} toggle={this.toggleEditModal}>
            {this.state.isEdited &&
              <Card>
                <Button size="sm" onClick={this.expandPictureInModal}>Expand Image</Button>
                <img className={this.state.isPictureInModalExpanded ? styles.avatarBig : styles.avatarSmall} src={this.state.currentProduct.picture} alt="Product Logo" />
                <CardBlock>
                  <span> Display Name </span>
                  <Input
                    type="text"
                    size="sm"
                    placeholder={this.state.currentProduct.displayName}
                    value={this.state.currentProduct.tempValues.displayName || ''}
                    onChange={this.handleChange}
                    name="displayName"
                  />
                  <span> Product Code </span>
                  <Input
                    size="sm"
                    type="text"
                    placeholder={this.state.currentProduct.productCode}
                    value={this.state.currentProduct.tempValues.productCode || ''}
                    name="productCode"
                    onChange={this.handleChange}
                  />
                  <span> Tags </span>
                  <br />
                  {this.state.currentProduct.tempValues.Tags.map((tag, index) => (
                    <Button size="sm" key={index} color="secondary" onClick={() => this.removeTag(index)}>
                    x {tag.displayName}
                    </Button>
                  ))}
                  <Button size="sm" color="success" onClick={this.toggleTagModal}> Add Tag </Button>
                  <br />
                  <span> Avatar </span>
                  <Input
                    size="sm"
                    type="text"
                    placeholder={this.state.currentProduct.picture}
                    value={this.state.currentProduct.tempValues.picture}
                    label="Picture (avatar)"
                    name="picture"
                    onChange={this.handleChange}
                  />
                  <br />
                  <Button onClick={this.handleCancel} color="warning" size="sm">Cancel</Button>
                  <Button onClick={this.saveDetailedHandler} color="success" size="sm">Save</Button>
                  <Modal isOpen={this.state.isTagModalOpen} toggle={this.toggleTagModal}>
                    <ModalBody>
                      {this.props.tags.map((tag, index) => (
                        <Button key={index} size="sm" color="secondary" onClick={() => this.addTag(tag)}>
                        + {tag.displayName}
                        </Button>
                      ))}
                      <br />
                      <Button size="sm" color="danger" onClick={this.toggleTagModal}>
                        Close
                      </Button>
                    </ModalBody>
                  </Modal>
                </CardBlock>
              </Card>
            }
          </Modal>
          <Table striped size="sm">
            <thead>
              <tr>
                <th width="40ox">id</th>
                <th width="64px">image</th>
                <th width="130px">brand</th>
                <th width="200px">tags</th>
                <th width="120px">name</th>
                <th width="300px">edits</th>
              </tr>
            </thead>
            <tbody>
              {this.props.products.map((product, index) => (
                <ProductComponent
                  key={index}
                  index={index}
                  product={product}
                  deepEditHandler={this.deepEditHandler}
                  saveHandler={this.saveHandler}
                  deleteHandler={this.deleteHandler}
                />
              ))}
            </tbody>
          </Table>
        </div>
      );
    }
    return null;
  }
}

Products.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.objectOf(PropTypes.string),
  products: PropTypes.arrayOf(PropTypes.object),
  tags: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = (state) => {
  console.log('STATE 0------');
  console.log(state.get('products'));
  console.log(state.get('tags'));
  return { products: state.get('products').products, tags: state.get('tags').tags };
};

export default connect(mapStateToProps)(Products);

import React, { Component, PropTypes } from 'react';
import { Table, Button, Breadcrumb, BreadcrumbItem, Card, CardBlock,
  Input, Modal, ModalBody, Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import PostComponent from './postComponent';
import SelectBrandComponent from './../Brands/selectBrandComponent';
import * as action from './action';
import * as actionTags from './../Tags/action';
import * as actionBrands from './../Brands/action';
import * as actionProducts from './../Products/action';
import styles from './styles.css';
import NewProductEntry from './../Products/newProductEntry';
import ScaledImage from './../../components/ScaledImage';
import BrandSelector from './../../components/BrandSelector';
import ProductSelector from './../../components/ProductSelector';

class Posts extends Component {
  // Fetching data method for both server/client side rendering
  static fetchData(dispatch) {
    return Promise.all([
      dispatch(action.fetchDataIfNeeded()),
      dispatch(actionTags.fetchDataIfNeeded()),
      dispatch(actionBrands.fetchDataIfNeeded()),
      dispatch(actionProducts.fetchDataIfNeeded()),
    ]);
  }
  static addProduct(dispatch, newPost) {
    return Promise.all([
      dispatch(action.addPost(newPost)),
    ]);
  }
  static removeProduct(dispatch, index) {
    return Promise.all([
      dispatch(action.removePost(index)),
    ]);
  }
  static deleteProduct(dispatch, id, index) {
    return Promise.all([
      dispatch(action.deletePost(id, index)),
    ]);
  }

  static updateProduct(dispatch, value) {
    return Promise.all([
      dispatch(action.updatePost(value)),
    ]);
  }
  static createProduct(dispatch, index, value) {
    // the index is the position in the current tags redux. Not the id on db.
    return Promise.all([
      dispatch(action.createPost(index, value)),
    ]);
  }
  constructor() {
    super();
    this.state = {
      isTagModalOpen: false,
      isEdited: false,
      isPictureInModalExpanded: false,
      isCreating: false,
      isTagNewProductModalOpen: false,
    };

    this.saveHandler = this.saveHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.deepEditHandler = this.deepEditHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.saveDetailedHandler = this.saveDetailedHandler.bind(this);
    this.expandPictureInModal = this.expandPictureInModal.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.addTag = this.addTag.bind(this);
    this.toggleCreateModal = this.toggleCreateModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleTagModal = this.toggleTagModal.bind(this);
    this.changeCurrentBrand = this.changeCurrentBrand.bind(this);
    this.handleChangeNewProduct = this.handleChangeNewProduct.bind(this);
    this.selectCurrentNewProduct = this.selectCurrentNewProduct.bind(this);
    this.addNewProductSameTemplate = this.addNewProductSameTemplate.bind(this);
    this.removeNewProduct = this.removeNewProduct.bind(this);
    this.toggleTagNewProductModal = this.toggleTagNewProductModal.bind(this);
    this.addTagToNewProduct = this.addTagToNewProduct.bind(this);
    this.duplicateProductHandler = this.duplicateProductHandler.bind(this);
    this.editAnotherElementHandler = this.editAnotherElementHandler.bind(this);
    this.onChangeHandlerNewProduct = this.onChangeHandlerNewProduct.bind(this);
    this.saveNewProducts = this.saveNewProducts.bind(this);
    this.changeNewProductBrand = this.changeNewProductBrand.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    // Fetching data for client side rendering
    Posts.fetchData(dispatch, params);
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

  onChangeHandlerNewProduct(index, state) {
    this.setState({
      ...this.state,
      newProducts: this.state.newProducts.slice(0, index)
        .concat(state)
        .concat(this.state.newProducts.slice(index + 1)),
    });
  }

  saveHandler(product) {
    const { dispatch } = this.props;
    const newValue = product.tempValues;
    const id = product.id;
    if (id) {
      // This is an existing tag, just update it.
      Posts.updateProduct(dispatch, newValue);
    } else {
      // This is a new tag, create it.
      Posts.createProduct(dispatch, product.index, newValue);
    }
  }

  saveDetailedHandler() {
    const { dispatch } = this.props;
    const newProduct = this.state.currentProduct.tempValues;
    const id = newProduct.id;
    const index = newProduct.index;
    if (id) {
      // This is an existing Product, just update it.
      Posts.updateProduct(dispatch, newProduct);
    } else {
      // This is a new Product, create it.
      Posts.createProduct(dispatch, index, newProduct);
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
      Posts.deleteProduct(dispatch, id, product.index);
    } else {
      // This is a new tag, create it.
      Posts.removeProduct(dispatch, product.index);
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

  handleChangeNewProduct(event) {
    this.setState({
      newProductsParameters: {
        ...this.state.newProductsParameters,
        [event.target.name]: event.target.value,
      },
    });
  }

  selectCurrentNewProduct(index) {
    this.setState({
      ...this.state,
      currentNewProductIndex: index,
    });
  }

  addNewProductSameTemplate() {
    this.setState({
      ...this.state,
      newProducts: this.state.newProducts.concat(
        this.state.newProducts[this.state.currentNewProductIndex],
      ),
    });
  }
  removeNewProduct(index) {
    if (this.state.newProducts.length === 1) {
      return;
    }
    this.setState({
      ...this.state,
      newProducts: this.state.newProducts.slice(0, index)
        .concat(this.state.newProducts.slice(index + 1)),
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

  toggleCreateModal() {
    this.setState({
      isCreating: !this.state.isCreating,
      newProductsParameters: {},
      newProducts: [
        {
          productCode: '',
          Tags: [],
          Brand: null,
          isEditing: true,
          tempValues: {},
        },
      ],
      currentNewProductIndex: 0,
    });
  }

  expandPictureInModal() {
    this.setState({
      isPictureInModalExpanded: !this.state.isPictureInModalExpanded,
    });
  }

  removeTag(index) {
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

  changeCurrentBrand(brand) {
    this.setState({
      currentProduct: {
        ...this.state.currentProduct,
        tempValues: {
          ...this.state.currentProduct.tempValues,
          Brand: brand,
        },
      },
    });
  }

  toggleTagModal() {
    this.setState({
      isTagModalOpen: !this.state.isTagModalOpen,
    });
  }
  addTag(tag) {
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

  toggleTagNewProductModal() {
    this.setState({
      isTagNewProductModalOpen: !this.state.isTagNewProductModalOpen,
    });
  }

  addTagToNewProduct(tag) {
    let found = false;
    const index = this.state.currentNewProductIndex;
    // check if tag exists already
    for (let i = 0; i < this.state.newProducts[index].Tags.length; i += 1) {
      if (this.state.newProducts[index].Tags[i].id === tag.id) {
        found = true;
      }
    }
    if (!found) {
      this.setState({
        ...this.state,
        newProducts: this.state.newProducts.slice(0, index)
          .concat({
            ...this.state.newProducts[index],
            Tags: this.state.newProducts[index].Tags.concat(tag),
          })
          .concat(this.state.newProducts.slice(index + 1)),
      });
    }
  }

  duplicateProductHandler(index) {
    this.setState({
      ...this.state,
      newProducts: this.state.newProducts.concat(
        {
          ...this.state.newProducts[index],
          isEditing: false,
        },
      ),
    });
  }

  editAnotherElementHandler(index) {
    this.setState({
      ...this.state,
      currentNewProductIndex: index,
    });
  }

  changeNewProductBrand(brand) {
    this.setState({
      newProductsParameters: {
        ...this.state.newProductsParameters,
        brand,
      },
    });
  }

  saveNewProducts() {
    const { dispatch } = this.props;
    let i = 0;
    for (; i < this.state.newProducts.length; i += 1) {
      Posts.addProduct(
        dispatch,
        {
          ...this.state.newProducts[i],
          ...this.state.newProductsParameters,
          BrandId: this.state.newProductsParameters.brand.id,
        },
      );
    }
    this.toggleCreateModal();
  }

  render() {
    if (this.props.posts) {
      return (
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Products</BreadcrumbItem>
            <BreadcrumbItem active>
              <Button color="success" onClick={this.toggleCreateModal} size="sm">Add Product</Button>
            </BreadcrumbItem>
            <BrandSelector />
            <ProductSelector />
          </Breadcrumb>
          <Modal
            className={styles.bigModal}
            isOpen={this.state.isCreating}
            toggle={this.toggleCreateModal}
          >
            {this.state.isCreating &&
              <Container>
                <Row className={styles.rowCentered}>
                  <Col>
                    <Button size="sm" color="success" onClick={this.saveNewProducts}> Save All </Button>
                    <Button size="sm" color="danger" onClick={this.toggleCreateModal}> Cancel All </Button>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    Display Name
                    <Input
                      type="text"
                      size="sm"
                      placeholder={this.state.newProductsParameters.displayName}
                      value={this.state.newProductsParameters.displayName}
                      onChange={this.handleChangeNewProduct}
                      name="displayName"
                    />
                  </Col>
                  <Col>
                    Brand
                    <SelectBrandComponent
                      brands={this.props.brands}
                      onChange={this.changeNewProductBrand}
                    />
                  </Col>
                  <Col>
                    Product code
                    <Input
                      type="text"
                      size="sm"
                      placeholder={this.state.newProductsParameters.productCode}
                      value={this.state.newProductsParameters.productCode}
                      onChange={this.handleChangeNewProduct}
                      name="productCode"
                    />
                  </Col>
                </Row>
                <hr />
                <Row>
                  Specific Product Informations
                </Row>
                {this.state.newProducts.map((product, index) =>
                  <NewProductEntry
                    isEditing={index === this.state.currentNewProductIndex}
                    key={index}
                    index={index}
                    product={product}
                    duplicateProductHandler={this.duplicateProductHandler}
                    editAnotherElementHandler={this.editAnotherElementHandler}
                    onChangeHandler={this.onChangeHandlerNewProduct}
                    removeProductHandler={this.removeNewProduct}
                  />,
                )}
                <Row className={styles.rowCentered}>
                  <Col>
                    <Button size="sm" color="success" onClick={this.saveNewProducts}> Save All </Button>
                    <Button size="sm" color="danger" onClick={this.toggleCreateModal}> Cancel All </Button>
                  </Col>
                </Row>
              </Container>
            }
          </Modal>
          <Modal isOpen={this.state.isEdited} toggle={this.toggleEditModal}>
            {this.state.isEdited &&
              <Card>
                <Button size="sm" onClick={this.expandPictureInModal}>Expand Image</Button>
                <ScaledImage
                  styles={
                    this.state.isPictureInModalExpanded ? styles.avatarBig : styles.avatarSmall
                  }
                  id={this.state.currentProduct.ImageId}
                  width={500}
                />
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
                  <span> Brand </span>
                  <SelectBrandComponent
                    brands={this.props.brands}
                    selectedItem={this.state.currentProduct.Brand}
                    onChange={this.changeCurrentBrand}
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
                <th width="100px">image</th>
                <th width="130px">brand</th>
                <th width="200px">tags</th>
                <th width="120px">name</th>
                <th width="300px">edits</th>
              </tr>
            </thead>
            <tbody>
              {this.props.posts.map((post, index) => (
                <PostComponent
                  key={index}
                  index={index}
                  post={post}
                  brands={this.props.brands}
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

Posts.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.objectOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.object),
  brands: PropTypes.arrayOf(PropTypes.object),
  posts: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
  products: state.get('products').products,
  tags: state.get('tags').tags,
  brands: state.get('brands').brands,
  posts: state.get('posts').posts,
});

export default connect(mapStateToProps)(Posts);

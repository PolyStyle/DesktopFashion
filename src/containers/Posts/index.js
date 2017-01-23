import React, { Component, PropTypes } from 'react';
import { Table, Button, Breadcrumb, BreadcrumbItem,
  Input, Modal, Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import PostComponent from './postComponent';
import * as action from './action';
import * as actionTags from './../Tags/action';
import * as actionBrands from './../Brands/action';
import * as actionProducts from './../Products/action';
import styles from './styles.css';
import ScaledImage from './../../components/ScaledImage';
import BrandSelector from './../../components/BrandSelector';
import ProductSelector from './../../components/ProductSelector';
import TagSelector from './../../components/TagSelector';
import Uploader from './../../components/Uploader';

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

  static updatePost(dispatch, value) {
    return Promise.all([
      dispatch(action.updatePost(value)),
    ]);
  }
  static createPost(dispatch, index, value) {
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
    this.changeCurrentProducts = this.changeCurrentProducts.bind(this);
    this.changeCurrentBrands = this.changeCurrentBrands.bind(this);
    this.changeCurrentTags = this.changeCurrentTags.bind(this);
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
    this.cancelCurrentPostImage = this.cancelCurrentPostImage.bind(this);
    this.imageCurrentProductUploadedHandler = this.imageCurrentProductUploadedHandler.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    // Fetching data for client side rendering
    Posts.fetchData(dispatch, params);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isEdited) {
      const id = this.state.currentPost.id;
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
        currentPost: {
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
    const newPost = this.state.currentPost.tempValues;
    const id = newPost.id;
    const index = newPost.index;
    if (id) {
      // This is an existing Product, just update it.
      Posts.updatePost(dispatch, newPost);
    } else {
      // This is a new Product, create it.
      Posts.createPost(dispatch, index, newPost);
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
      currentPost: {
        ...product,
        tempValues: product,
      },
    });
  }

  handleChange(event) {
    this.setState({
      currentPost: {
        ...this.state.currentPost,
        tempValues: {
          ...this.state.currentPost.tempValues,
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
      isEdited: !this.state.isEdited,
      currentPost: {
        index: this.props.posts.length,
        productCode: '',
        Tags: [],
        Brands: [],
        Products: [],
        ImageId: -1,
        tempValues: {
          index: this.props.posts.length,
          productCode: '',
          Tags: [],
          Brands: [],
          Products: [],
          ImageId: -1,
        },
      },
    });
  }

  expandPictureInModal() {
    this.setState({
      isPictureInModalExpanded: !this.state.isPictureInModalExpanded,
    });
  }

  removeTag(index) {
    this.setState({
      currentPost: {
        ...this.state.currentPost,
        tempValues: {
          ...this.state.currentPost.tempValues,
          Tags: this.state.currentPost.tempValues.Tags.slice(0, index)
            .concat(this.state.currentPost.tempValues.Tags.slice(index + 1)),
        },
      },
    });
  }

  removeBrand(index) {
    this.setState({
      currentPost: {
        ...this.state.currentPost,
        tempValues: {
          ...this.state.currentPost.tempValues,
          Brands: this.state.currentPost.tempValues.Brands.slice(0, index)
            .concat(this.state.currentPost.tempValues.Brands.slice(index + 1)),
        },
      },
    });
  }

  changeCurrentBrands(brands) {
    this.setState({
      currentPost: {
        ...this.state.currentPost,
        tempValues: {
          ...this.state.currentPost.tempValues,
          Brands: brands,
        },
      },
    });
  }

  changeCurrentTags(tags) {
    this.setState({
      currentPost: {
        ...this.state.currentPost,
        tempValues: {
          ...this.state.currentPost.tempValues,
          Tags: tags,
        },
      },
    });
  }

  changeCurrentProducts(products) {
    console.log('CHANGE CURRENT PRODUCTS');
    console.log(products);
    this.setState({
      currentPost: {
        ...this.state.currentPost,
        tempValues: {
          ...this.state.currentPost.tempValues,
          Products: products,
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
    for (let i = 0; i < this.state.currentPost.tempValues.Tags.length; i += 1) {
      if (this.state.currentPost.tempValues.Tags[i].id === tag.id) {
        found = true;
      }
    }
    if (!found) {
      this.setState({
        currentPost: {
          ...this.state.currentPost,
          tempValues: {
            ...this.state.currentPost.tempValues,
            Tags: this.state.currentPost.tempValues.Tags.concat([tag]),
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

  cancelCurrentPostImage() {
    console.log('CANCEL IMAGE');
    this.setState({
      currentPost: {
        ...this.state.currentPost,
        tempValues: {
          ...this.state.currentPost.tempValues,
          ImageId: -1,
        },
      },
    });
  }

  imageCurrentProductUploadedHandler(file, response) {
    const responseObject = JSON.parse(response);
    this.setState({
      currentPost: {
        ...this.state.currentPost,
        tempValues: {
          ...this.state.currentPost.tempValues,
          ImageId: responseObject.id,
        },
      },
    });
  }


  render() {
    if (this.props.posts) {
      return (
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Products</BreadcrumbItem>
            <BreadcrumbItem active>
              <Button color="success" onClick={this.toggleCreateModal} size="sm">Add Post</Button>
            </BreadcrumbItem>
          </Breadcrumb>
          <Modal
            isOpen={this.state.isEdited}
            toggle={this.toggleEditModal}
            className={styles.bigModal}
          >
            {this.state.isEdited &&
              <Container className={styles.editMode}>
                <Row>
                  <Col className={styles.imageColumn}>
                    <Button
                      size="sm"
                      onClick={this.expandPictureInModal}
                      className={styles.absoluteButton}
                      color="primary"
                    >
                      Expand Image
                    </Button>
                    <Button
                      size="sm"
                      onClick={this.cancelCurrentPostImage}
                      className={styles.absoluteButtonSecondRow}
                      color="danger"
                    >
                      Cancel Image
                    </Button>
                    {this.state.currentPost.tempValues.ImageId >= 0 &&
                      <ScaledImage
                        styles={
                          this.state.isPictureInModalExpanded ?
                          styles.avatarBig :
                          styles.avatarSmall
                        }
                        id={this.state.currentPost.tempValues.ImageId}
                        width={300}
                      />
                    }
                    {this.state.currentPost.tempValues.ImageId < 0 &&
                      <div className={styles.uploadCurrentProductPicture}>
                        <Uploader
                          callBackFileUploaded={this.imageCurrentProductUploadedHandler}
                          maxFiles={1}
                          sizes={[{ width: 1000, height: 1500 }, { width: 2000, height: 3000 }]}
                        />
                      </div>
                    }
                  </Col>
                  <Col>
                    <span> Description: </span>
                    <Input
                      type="textarea"
                      size="sm"
                      placeholder={this.state.currentPost.description}
                      value={this.state.currentPost.tempValues.description || ''}
                      onChange={this.handleChange}
                      name="description"
                    />
                    <hr />
                    Current Products: <br />
                    {this.state.currentPost.tempValues.Products.map((product, index) => (
                      <ScaledImage key={index} styles={styles.productImage} id={product.ImageId} />
                    ))}
                    <ProductSelector
                      currentAddedProducts={this.state.currentPost.tempValues.Products}
                      onProductSaveHandler={this.changeCurrentProducts}
                    />
                    <hr />
                    <span> Brands: </span>
                    <br />
                    {this.state.currentPost.tempValues.Brands.map((brand, index) => (
                      <Button size="sm" key={index} color="secondary" onClick={() => this.removeBrand(index)}>
                      x {brand.displayName}
                      </Button>
                    ))}
                    <BrandSelector
                      currentAddedBrands={this.state.currentPost.tempValues.Brands}
                      onBrandSaveHandler={this.changeCurrentBrands}
                    />
                    <hr />
                    <span> Tags: </span>
                    <br />
                    {this.state.currentPost.tempValues.Tags.map((tag, index) => (
                      <Button size="sm" key={index} color="secondary" onClick={() => this.removeTag(index)}>
                      x {tag.displayName}
                      </Button>
                    ))}
                    <TagSelector
                      currentAddedTags={this.state.currentPost.tempValues.Tags}
                      onTagSaveHandler={this.changeCurrentTags}
                    />
                    <br />
                    <hr />
                    <br />
                    <Button onClick={this.handleCancel} color="warning" size="sm">Cancel</Button>
                    <Button onClick={this.saveDetailedHandler} color="success" size="sm">Save</Button>
                  </Col>
                </Row>
              </Container>
            }
          </Modal>
          <Table striped size="sm">
            <thead>
              <tr>
                <th width="40ox">id</th>
                <th width="100px">image</th>
                <th width="130px">brand</th>
                <th width="120px">tags</th>
                <th width="220px">products</th>
                <th width="120px">description</th>
                <th width="100px">edits</th>
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
  brands: PropTypes.arrayOf(PropTypes.object),
  posts: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
  products: state.get('products').products,
  brands: state.get('brands').brands,
  posts: state.get('posts').posts,
});

export default connect(mapStateToProps)(Posts);

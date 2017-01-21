import React, { Component, PropTypes } from 'react';
import { Table, Button, Breadcrumb, BreadcrumbItem, Card, CardBlock,
  Input, Modal, ModalBody, Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import ProductComponent from './productComponent';
import SelectBrandComponent from './../Brands/selectBrandComponent';
import * as action from './action';
import * as actionTags from './../Tags/action';
import * as actionBrands from './../Brands/action';
import styles from './styles.css';
import Uploader from './../../components/Uploader';

class Products extends Component {
  // Fetching data method for both server/client side rendering
  static fetchData(dispatch) {
    return Promise.all([
      dispatch(action.fetchDataIfNeeded()),
      dispatch(actionTags.fetchDataIfNeeded()),
      dispatch(actionBrands.fetchDataIfNeeded()),
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
      isCreating: false,
      isTagNewProductModalOpen: false,
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

  handleChangeNewProduct(event) {
    const currentIndex = this.state.currentNewProductIndex;
    this.setState({
      ...this.state,
      newProducts: this.state.newProducts.slice(0, currentIndex)
        .concat(
        {
          ...this.state.newProducts[currentIndex],
          tempValues: {
            ...this.state.newProducts[currentIndex].tempValues,
            [event.target.name]: event.target.value,
          },
        },
        )
        .concat(this.state.newProducts.slice(currentIndex + 1)),
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
    const newIndex = Math.max(0, index - 1);
    this.setState({
      ...this.state,
      newProducts: this.state.newProducts.slice(0, index)
        .concat(this.state.newProducts.slice(index + 1)),
      currentNewProductIndex: newIndex,
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
      newProducts: [
        {
          displayName: '',
          productCode: '',
          Tags: [],
          Brand: null,
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
    console.log('Closing modal');
    this.setState({
      isTagNewProductModalOpen: !this.state.isTagNewProductModalOpen,
    });
  }
  addTagToNewProduct(tag) {
    console.log('adding TAG ');
    let found = false;
    const index = this.state.currentNewProductIndex;
    // check if tag exists already
    console.log('CHECK TAGS', this.state.newProducts[index].Tags.length);
    for (let i = 0; i < this.state.newProducts[index].Tags.length; i += 1) {
      if (this.state.newProducts[index].Tags[i].id === tag.id) {
        found = true;
      }
    }
    console.log('Found : ', found);
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


  render() {
    if (this.props.products) {
      return (
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Products</BreadcrumbItem>
            <BreadcrumbItem active>
              <Button color="success" onClick={this.toggleCreateModal} size="sm">Add Product</Button>
            </BreadcrumbItem>
          </Breadcrumb>
          <Modal
            className={styles.bigModal}
            isOpen={this.state.isCreating}
            toggle={this.toggleCreateModal}
          >
            <Modal
              isOpen={this.state.isTagNewProductModalOpen}
              toggle={this.toggleTagNewProductModal}
            >
              <ModalBody>
                {this.props.tags.map((tag, index) => (
                  <Button key={index} size="sm" color="secondary" onClick={() => this.addTagToNewProduct(tag)}>
                  + {tag.displayName}
                  </Button>
                ))}
                <br />
                <Button size="sm" color="danger" onClick={this.toggleTagNewProductModal}>
                  Close
                </Button>
              </ModalBody>
            </Modal>
            {this.state.isCreating &&
              <Container>
                <Row className={styles.rowCentered}>
                  <Col>
                    <Button size="sm" onClick={this.addNewProductSameTemplate} color="primary"> Add Product with same Template </Button>
                    <Button size="sm" color="success"> Save All </Button>
                    <Button size="sm" color="danger"> Cancel All </Button>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    Display Name
                    <Input
                      type="text"
                      size="sm"
                      placeholder={
                        this.state.newProducts[this.state.currentNewProductIndex].displayName
                      }
                      value={this.state.newProducts[this.state.currentNewProductIndex].tempValues.displayName || ''}
                      onChange={this.handleChangeNewProduct}
                      name="displayName"
                    />
                  </Col>
                  <Col>
                    Brand
                    <SelectBrandComponent brands={this.props.brands} />
                  </Col>
                  <Col>
                    Product code
                    <Input
                      type="text"
                      size="sm"
                      placeholder={
                        this.state.newProducts[this.state.currentNewProductIndex].productCode
                      }
                      value={this.state.newProducts[this.state.currentNewProductIndex].tempValues.productCode || ''}
                      onChange={this.handleChangeNewProduct}
                      name="productCode"
                    />
                  </Col>
                </Row>
                <hr />
                <Row>
                  Specific Product Informations
                </Row>
                {this.state.newProducts.map((product, index) => {
                  if (index === this.state.currentNewProductIndex) {
                    return (
                      <Row className={styles.rowEntrySelected} key={index}>
                        <Col>
                          <Uploader displayName="UploadeR" />
                        </Col>
                        <Col>
                          <span> Product Image </span>
                          <Input
                            type="text"
                            size="sm"
                            placeholder={
                              this.state.newProducts[this.state.currentNewProductIndex].picture
                            }
                            value={this.state.newProducts[this.state.currentNewProductIndex].tempValues.picture || ''}
                            onChange={this.handleChangeNewProduct}
                            name="picture"
                          />
                          <span> Tags: </span>
                          {this.state.newProducts[index].Tags.map((tag, indexTag) => (
                            <Button size="sm" key={indexTag} color="secondary" onClick={() => this.removeTag(indexTag)}>
                            x {tag.displayName}
                            </Button>
                          ))}
                          <Button size="sm" color="success" onClick={this.toggleTagNewProductModal}> Add Tag </Button>
                        </Col>
                        <Col>
                          <Button size="sm" onClick={this.addNewProductSameTemplate} color="primary"> Duplicate Item </Button>
                          <Button size="sm" onClick={() => this.removeNewProduct(index)} color="danger"> Delete Item </Button>
                        </Col>
                      </Row>
                    );
                  }
                  return (
                    <Row className={styles.rowEntry} key={index}>
                      <Col>
                        <img
                          className={styles.avatarTable}
                          src={this.state.newProducts[index].tempValues.picture}
                          alt="Product"
                        />
                      </Col>
                      <Col>
                        {this.state.newProducts[index].Tags.map((tag, indexTag) => (
                          <span
                            key={indexTag}
                            className={styles.tagLabel}
                          >
                            {tag.displayName}
                          </span>
                        ))}
                      </Col>
                      <Col>
                        <Button size="sm" color="secondary" onClick={() => this.selectCurrentNewProduct(index)} > Edit this Item </Button>
                      </Col>
                    </Row>
                  );
                })}
                <Row className={styles.rowCentered}>
                  <Col>
                    <Button size="sm" onClick={this.addNewProductSameTemplate} color="primary"> Add Product with same Template </Button>
                    <Button size="sm" color="success"> Save All </Button>
                    <Button size="sm" color="danger"> Cancel All </Button>
                  </Col>
                </Row>
              </Container>
            }
          </Modal>
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

Products.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.objectOf(PropTypes.string),
  products: PropTypes.arrayOf(PropTypes.object),
  tags: PropTypes.arrayOf(PropTypes.object),
  brands: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
  products: state.get('products').products,
  tags: state.get('tags').tags,
  brands: state.get('brands').brands,
});

export default connect(mapStateToProps)(Products);

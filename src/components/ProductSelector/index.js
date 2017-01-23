import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, Container, Row, Col, Input } from 'reactstrap';
import styles from './styles.css';

import ScaledImage from './../ScaledImage';

class ProductSelector extends React.Component {
  static validateMatch(pattern, parameters, object) {
    let found = false;
    let p = 0;
    for (; p < parameters.length; p += 1) {
      if (object[parameters[p]].toUpperCase().indexOf(pattern.toUpperCase()) > -1) {
        found = true;
      }
    }
    return found;
  }

  constructor(props) {
    super(props);
    this.state = {
      products: this.props.products,
      addedProducts: this.props.currentAddedProducts,
      isProductModalOpen: false,
      search: {
        value: 'Search Product',
        temp: '',
      },
      size: 5,
      addMore: 10,
      productSearch: this.props.products,
    };
    // For a full list of possible configurations
    // please consult http://www.dropzonejs.com/#configuration
    this.onSaveAll = this.onSaveAll.bind(this);
    this.onCancelAll = this.onCancelAll.bind(this);
    this.toggleProductModal = this.toggleProductModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.startSearch = this.startSearch.bind(this);
    this.showMore = this.showMore.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      products: nextProps.products,
      productSearch: nextProps.products,
    });
  }

  onSaveAll() {
    this.setState({
      isProductModalOpen: false,
    });
    if (this.props.onProductSaveHandler) {
      this.props.onProductSaveHandler(this.state.addedProducts);
    }
  }

  onCancelAll() {
    if (this.props.onCancelAllHandler) {
      this.props.onCancelAllHandler(this.state.addedProducts);
    }
  }

  addProduct(index) {
    this.setState({
      productSearch:
        this.state.productSearch.slice(0, index)
        .concat(this.state.productSearch.slice(index + 1)),
      addedProducts: this.state.addedProducts.concat(this.state.productSearch[index]),
    });
  }

  removeProduct(index) {
    this.setState({
      addedProducts:
        this.state.addedProducts.slice(0, index)
        .concat(this.state.addedProducts.slice(index + 1)),
      productSearch: this.state.productSearch.concat(this.state.addedProducts[index]),
    });
  }

  toggleProductModal() {
    if (this.state.isProductModalOpen) {
      // Modal is Open
      this.setState({
        isProductModalOpen: false,
      });
    } else {
      this.setState({
        isProductModalOpen: true,
      });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: {
        temp: event.target.value,
      },
    });
    this.startSearch();
  }

  startSearch() {
    const termToSearch = this.state.search.temp;

    let i = 0;
    const searchResults = [];
    const parameters = ['displayName', 'productCode'];
    for (; i < this.state.products.length; i += 1) {
      const item = this.state.products[i];
      if (ProductSelector.validateMatch(termToSearch, parameters, item)) {
        searchResults.push(item);
      }
    }
    this.setState({
      productSearch: searchResults,
      size: 5,
    });
  }

  showMore() {
    this.setState({
      size:
        this.state.size +
        Math.min(
          (this.state.productSearch.length - this.state.size),
          this.state.addMore,
        ),
    });
  }

  render() {
    return (
      <div>
        <Button size="sm" color="success" onClick={this.toggleProductModal}> Edit Products </Button>
        <Modal
          className={styles.bigModal}
          isOpen={this.state.isProductModalOpen}
          toggle={this.toggleProductModal}
        >
          <ModalBody>
            <div className={styles.searchProducts}>
              <h5>Search for a product</h5>
              <Row>
                <Col>
                  <Input
                    type="text"
                    size="sm"
                    placeholder={this.state.search.value}
                    value={this.state.search.temp || ''}
                    onChange={this.handleChange}
                    name="search"
                  />
                </Col>
                <Col>
                  <Button size="sm" color="success" onClick={this.startSearch}>
                    Search
                  </Button>
                </Col>
              </Row>
            </div>
            <div className={styles.selectProducts}>
              <h5> Select Products </h5>
              {this.state.productSearch.slice(0, this.state.size).map((product, index) => (
                <Row className={styles.availableRow} onClick={() => this.addProduct(index)}>
                  <Col className={styles.imageHolder}>
                    <ScaledImage styles={styles.imagePreview} id={product.ImageId} />
                  </Col>
                  <Col>
                    <strong>Display Name:</strong> {product.displayName} <br />
                    <strong>Product Code:</strong> {product.productCode}
                  </Col>
                </Row>
              ))}
              {(this.state.productSearch.length - this.state.size) > 0 &&
                <Container>
                  <Row>
                    There are other {this.state.productSearch.length - this.state.size} elements
                  </Row>
                  <Row>
                    <Button size="sm" color="primary" onClick={this.showMore}>
                      {'Show '}
                      {Math.min(
                        (this.state.productSearch.length - this.state.size),
                        this.state.addMore,
                      )}
                      {' more'}
                    </Button>
                  </Row>
                </Container>
              }
            </div>
            <div className={styles.selectedProducts}>
              <h5> Select Products </h5>
              <Container>
                {this.state.addedProducts.map((product, index) => (
                  <Row className={styles.selectedRow} onClick={() => this.removeProduct(index)}>
                    <Col className={styles.imageHolder}>
                      <ScaledImage styles={styles.imagePreview} id={product.ImageId} />
                    </Col>
                    <Col>
                      <strong>Display Name:</strong> {product.displayName} <br />
                      <strong>Product Code:</strong> {product.productCode}
                    </Col>
                  </Row>
                ))}
              </Container>
            </div>
            <div className={styles.buttons}>
              <Button size="sm" color="success" onClick={this.onSaveAll}> Save All </Button>
              <Button size="sm" color="danger" onClick={this.toggleProductModal}> Cancel All </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

ProductSelector.defaultProps = {
  products: [],
  currentAddedProducts: [],
};

ProductSelector.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  onCancelAllHandler: PropTypes.func,
  onProductSaveHandler: PropTypes.func,
  currentAddedProducts: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({ products: state.get('products').products });

export default connect(mapStateToProps)(ProductSelector);

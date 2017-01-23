import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody } from 'reactstrap';
import styles from './styles.css';


class BrandSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: this.props.brands,
      addedBrands: this.props.currentAddedBrands,
      isBrandModalOpen: false,
    };
    // For a full list of possible configurations,
    // please consult http://www.dropzonejs.com/#configuration
    this.onSaveAll = this.onSaveAll.bind(this);
    this.onCancelAll = this.onCancelAll.bind(this);
    this.toggleBrandModal = this.toggleBrandModal.bind(this);
  }

  onSaveAll() {
    this.setState({
      isBrandModalOpen: false,
    });
    if (this.props.onBrandSaveHandler) {
      this.props.onBrandSaveHandler(this.state.addedBrands);
    }
  }

  onCancelAll() {
    if (this.props.onCancelAllHandler) {
      this.props.onCancelAllHandler(this.state.addedBrands);
    }
  }

  addBrand(index) {
    this.setState({
      brands:
        this.state.brands.slice(0, index)
        .concat(this.state.brands.slice(index + 1)),
      addedBrands: this.state.addedBrands.concat(this.state.brands[index]),
    });
  }

  removeBrand(index) {
    this.setState({
      addedBrands:
        this.state.addedBrands.slice(0, index)
        .concat(this.state.addedBrands.slice(index + 1)),
      brands: this.state.brands.concat(this.state.addedBrands[index]),
    });
  }

  toggleBrandModal() {
    if (this.state.isBrandModalOpen) {
      // Modal is Open
      this.setState({
        isBrandModalOpen: false,
      });
    } else {
      this.setState({
        isBrandModalOpen: true,
      });
    }
  }

  render() {
    return (
      <div>
        <Button size="sm" color="success" onClick={this.toggleBrandModal}> Edit Brands </Button>
        <Modal
          className={styles.bigModal}
          isOpen={this.state.isBrandModalOpen}
          toggle={this.toggleBrandModal}
        >
          <ModalBody>
            <div className={styles.selectBrands}>
              <h5> Select Brands </h5>
              {this.state.brands.map((brand, index) => (
                <Button key={index} size="sm" color="secondary" onClick={() => this.addBrand(index)}>
                + {brand.displayName}
                </Button>
              ))}
            </div>
            <div className={styles.selectedBrands}>
              <h5> Select Brands </h5>
              {this.state.addedBrands.map((brand, index) => (
                <Button key={index} size="sm" color="primary" onClick={() => this.removeBrand(index)}>
                - {brand.displayName}
                </Button>
              ))}
            </div>
            <div className={styles.buttons}>
              <Button size="sm" color="success" onClick={this.onSaveAll}> Save All </Button>
              <Button size="sm" color="danger" onClick={this.toggleBrandModal}> Cancel All </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

BrandSelector.defaultProps = {
  brands: [],
  currentAddedBrands: [],
};

BrandSelector.propTypes = {
  brands: PropTypes.arrayOf(PropTypes.object),
  onCancelAllHandler: PropTypes.func,
  onBrandSaveHandler: PropTypes.func,
  currentAddedBrands: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({ brands: state.get('brands').brands });

export default connect(mapStateToProps)(BrandSelector);

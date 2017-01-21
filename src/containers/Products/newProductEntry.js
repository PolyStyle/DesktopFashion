import React, { PropTypes } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import styles from './styles.css';
import Uploader from './../../components/Uploader';


export default class NewProductEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempValues: {},
      picture: '',
      ...this.props.product,
      Tags: [],
      isEditing: this.props.isEditing,
    };

    this.removeTag = this.removeTag.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.duplicateProduct = this.duplicateProduct.bind(this);
    this.selectCurrentRow = this.selectCurrentRow.bind(this);
    this.imageUploadedHandler = this.imageUploadedHandler.bind(this);
    this.imageRemovedHandler = this.imageRemovedHandler.bind(this);
    this.editItem = this.editItem.bind(this);
    this.resetLoader = this.resetLoader.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileAddedHandler = this.fileAddedHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isEditing: nextProps.isEditing,
    });
  }
  onChange() {
    console.log('CHANGE', this.props.index, this.state);
    if (this.props.onChangeHandler) {
      this.props.onChangeHandler(this.props.index, this.state);
    }
  }

  selectCurrentRow() {
    if (this.props.selectedRowHandler) {
      this.props.selectedRowHandler(this.props.index);
    }
  }

  duplicateProduct() {
    if (this.props.duplicateProductHandler) {
      this.props.duplicateProductHandler(this.props.index);
    }
  }

  removeProduct() {
    console.log('trying to remove this product', this);
  }

  removeTag(index) {
    console.log('remove tag of index ', index, this);
  }

  fileAddedHandler() {
    console.log('added file');
    this.editItem();
  }

  imageUploadedHandler(file, response) {
    const responseObject = JSON.parse(response);
    this.setState({
      ...this.state,
      previewBase64: file.previewElement.firstElementChild.firstElementChild.currentSrc,
      picture: responseObject.id,
    }, this.onChange);
  }

  imageRemovedHandler() {
    console.log('Remove image HANDLER');
    this.setState({
      ...this.state,
      picture: null,
      previewBase64: null,
    }, this.onChange);
  }

  editItem() {
    this.setState({
      ...this.state,
      isEditing: true,
    }, this.onChange);
    if (this.props.editAnotherElementHandler) {
      this.props.editAnotherElementHandler(this.props.index);
    }
  }

  resetLoader() {
    this.setState({
      previewBase64: null,
    }, this.onChange);
  }

  render() {
    if (this.state.isEditing) {
      return (
        <Row className={styles.rowEntrySelected} key={this.props.index}>
          <Col>
            {this.state.previewBase64 &&
              <div className={styles.avatarHolder}>
                <img
                  className={styles.avatarTable}
                  src={this.state.previewBase64}
                  alt="Missing file"
                />
                <Button onClick={this.resetLoader} className={styles.dzRemove} />
              </div>
            }
            {!this.state.previewBase64 &&
              <Uploader
                callBackFileUploaded={this.imageUploadedHandler}
                callBackFileRemoved={this.imageRemovedHandler}
                callBackFileAdded={this.fileAddedHandler}
                maxFiles={1}
              />
            }
          </Col>
          <Col>
            <span> Product Image {this.props.isEditing}</span>
            <Input
              type="text"
              size="sm"
              placeholder={
                this.state.picture
              }
              value={this.state.tempValues.picture || ''}
              onChange={this.handleChangeNewProduct}
              name="picture"
            />
            <span> Tags: </span>
          </Col>
          <Col>
            <Button size="sm" onClick={this.duplicateProduct} color="primary"> Duplicate Item </Button>
            <Button size="sm" onClick={this.removeProduct} color="danger"> Delete Item </Button>
          </Col>
        </Row>
      );
    }
    return (
      <Row className={styles.rowEntry} key={this.props.index}>
        <Col>
          {this.state.previewBase64 &&
            <img
              className={styles.avatarTable}
              src={this.state.previewBase64}
              alt="Missing file"
            />
          }
          {!this.state.previewBase64 &&
            <Uploader
              callBackFileUploaded={this.imageUploadedHandler}
              callBackFileRemoved={this.imageRemovedHandler}
              callBackFileAdded={this.fileAddedHandler}
              maxFiles={1}
            />
          }
        </Col>
        <Col>
          {this.state.Tags.map((tag, indexTag) => (
            <span
              key={indexTag}
              className={styles.tagLabel}
            >
              {tag.displayName}
            </span>
          ))}
        </Col>
        <Col>
          <Button size="sm" color="secondary" onClick={this.editItem} > Edit this Item </Button>
        </Col>
      </Row>
    );
  }
}

NewProductEntry.defaultProps = {
  isEditing: true,
};

NewProductEntry.propTypes = {
  index: PropTypes.number,
  isEditing: PropTypes.bool,
  product: PropTypes.objectOf(PropTypes.object),
  selectedRowHandler: PropTypes.func,
  duplicateProductHandler: PropTypes.func,
  editAnotherElementHandler: PropTypes.func,
  onChangeHandler: PropTypes.func,

};

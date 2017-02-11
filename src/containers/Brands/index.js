import React, { Component, PropTypes } from 'react';
import { Table, Button, Breadcrumb, BreadcrumbItem, Card, CardBlock,
  Container, Row, Col, Input } from 'reactstrap';
import { connect } from 'react-redux';
import BrandComponent from './brandComponent';
import * as action from './action';
import styles from './styles.css';
import Uploader from './../../components/Uploader';
import ScaledImage from './../../components/ScaledImage';

class Brands extends Component {
  // Fetching data method for both server/client side rendering
  static fetchData(dispatch) {
    return Promise.all([
      dispatch(action.fetchDataIfNeeded()),
    ]);
  }
  static addBrand(dispatch) {
    return Promise.all([
      dispatch(action.addBrand()),
    ]);
  }
  static removeBrand(dispatch, index) {
    return Promise.all([
      dispatch(action.removeBrand(index)),
    ]);
  }
  static deleteBrand(dispatch, id, index) {
    return Promise.all([
      dispatch(action.deleteBrand(id, index)),
    ]);
  }

  static updateBrand(dispatch, value) {
    return Promise.all([
      dispatch(action.updateBrand(value)),
    ]);
  }
  static createBrand(dispatch, index, value) {
    // the index is the position in the current tags redux. Not the id on db.
    return Promise.all([
      dispatch(action.createBrand(index, value)),
    ]);
  }
  constructor() {
    super();
    this.state = {
      isEdited: false,
    };
    this.addBrandHandler = this.addBrandHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.deepEditHandler = this.deepEditHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.saveDetailedHandler = this.saveDetailedHandler.bind(this);
    this.imageBrandBackgroundUploadedHandler = this.imageBrandBackgroundUploadedHandler.bind(this);
    this.imageBrandAvatarUploadedHandler = this.imageBrandAvatarUploadedHandler.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    // Fetching data for client side rendering
    Brands.fetchData(dispatch, params);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.state.isEdited);
    if (this.state.isEdited) {
      const id = this.state.currentBrand.id;
      let brand = null;
      let i = 0;
      for (; i < nextProps.brands.length; i += 1) {
        if (nextProps.brands[i].id === id) {
          brand = nextProps.brands[i];
        }
      }
      if (!brand) {
        return;
      }

      console.log('Next Props', nextProps);
      this.setState({
        currentBrand: {
          ...brand,
          tempValues: brand,
        },
      });
    }
  }

  addBrandHandler() {
    const { dispatch } = this.props;
    Brands.addBrand(dispatch);
  }

  saveHandler(brand) {
    const { dispatch } = this.props;
    const newValue = brand.tempValues;
    const id = brand.id;
    if (id) {
      // This is an existing tag, just update it.
      Brands.updateBrand(dispatch, newValue);
    } else {
      // This is a new tag, create it.
      Brands.createBrand(dispatch, brand.index, newValue);
    }
  }

  saveDetailedHandler() {
    const { dispatch } = this.props;
    const newBrand = this.state.currentBrand.tempValues;
    const id = newBrand.id;
    const index = newBrand.index;

    console.log('-------');
    console.log(newBrand);
    console.log(index);
    console.log('-------');
    if (id) {
      // This is an existing brand, just update it.
      Brands.updateBrand(dispatch, newBrand);
    } else {
      // This is a new brand, create it.
      Brands.createBrand(dispatch, index, newBrand);
    }
  }

  deleteHandler(brand) {
    const { dispatch } = this.props;
    const id = brand.id;
    if (id) {
      // This is an existing tag, just update it.
      Brands.deleteBrand(dispatch, id, brand.index);
    } else {
      // This is a new tag, create it.
      console.log('trying to remove brand with index', brand.index);
      Brands.removeBrand(dispatch, brand.index);
    }
  }

  deepEditHandler(brand) {
    console.log('EDIT BRAND', brand);
    this.setState({
      isEdited: true,
      currentBrand: {
        ...brand,
        tempValues: brand,
      },
    });
  }

  handleChange(event) {
    this.setState({
      currentBrand: {
        ...this.state.currentBrand,
        tempValues: {
          ...this.state.currentBrand.tempValues,
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

  imageBrandBackgroundUploadedHandler(file, response) {
    const responseObject = JSON.parse(response);
    this.setState({
      currentBrand: {
        ...this.state.currentBrand,
        BackgroundImageId: responseObject.id,
        tempValues: {
          ...this.state.currentBrand.tempValues,
          BackgroundImageId: responseObject.id,
        },
      },
    });
  }

  imageBrandAvatarUploadedHandler(file, response) {
    const responseObject = JSON.parse(response);
    this.setState({
      currentBrand: {
        ...this.state.currentBrand,
        AvatarImageId: responseObject.id,
        tempValues: {
          ...this.state.currentBrand.tempValues,
          AvatarImageId: responseObject.id,
        },
      },
    });
  }

  render() {
    if (this.props.brands) {
      return (
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Brands</BreadcrumbItem>
            <BreadcrumbItem active>
              <Button color="success" onClick={this.addBrandHandler} size="sm">Add Brand</Button>
            </BreadcrumbItem>
          </Breadcrumb>
          {this.state.isEdited &&
            <Container>
              <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                  <Card>
                    <CardBlock>
                      <Container>
                        <Row>
                          <Col>
                            <span> Upload background Image </span>
                            <Uploader
                              callBackFileUploaded={this.imageBrandBackgroundUploadedHandler}
                              maxFiles={1}
                              sizes={[
                                { width: 320, height: 480 },
                                { width: 640, height: 1136 },
                                { width: 1242, height: 2208 },
                                { width: 2000, height: 3000 },
                              ]}
                            />
                          </Col>
                          <Col>
                            <span> Upload avatar Image </span>
                            <Uploader
                              callBackFileUploaded={this.imageBrandAvatarUploadedHandler}
                              maxFiles={1}
                              sizes={[
                                { width: 320, height: 320 },
                                { width: 640, height: 640 },
                                { width: 1280, height: 1280 },
                                { width: 2000, height: 2000 },
                              ]}
                            />
                          </Col>
                        </Row>
                      </Container>
                      <ScaledImage
                        styles={styles.backgroundHeader}
                        id={this.state.currentBrand.BackgroundImageId}
                      />
                      <ScaledImage
                        styles={styles.avatar}
                        id={this.state.currentBrand.AvatarImageId}
                      />
                      <span> Display Name </span>
                      <Input
                        type="text"
                        size="sm"
                        placeholder={this.state.currentBrand.displayName}
                        value={this.state.currentBrand.tempValues.displayName}
                        onChange={this.handleChange}
                        name="displayName"
                      />
                      <span> Background Header </span>
                      <Input
                        size="sm"
                        type="text"
                        placeholder={this.state.currentBrand.BackgroundImageId}
                        value={this.state.currentBrand.tempValues.BackgroundImageId}
                        name="BackgroundImageId"
                        onChange={this.handleChange}
                      />
                      <span> Avatar </span>
                      <Input
                        size="sm"
                        type="text"
                        placeholder={this.state.currentBrand.AvatarImageId}
                        value={this.state.currentBrand.tempValues.AvatarImageId}
                        label="Picture (avatar)"
                        name="AvatarImageId"
                        onChange={this.handleChange}
                      />
                      <br />
                      <Button onClick={this.handleCancel} color="warning" size="sm">Cancel</Button>
                      <Button onClick={this.saveDetailedHandler} color="success" size="sm">Save</Button>
                    </CardBlock>
                  </Card>
                </Col>
              </Row>
            </Container>
          }
          <Table striped size="sm">
            <thead>
              <tr>
                <th width="15%">id</th>
                <th width="64px">logo</th>
                <th width="35%">title</th>
                <th width="35%">edits</th>
              </tr>
            </thead>
            <tbody>
              {this.props.brands.map((brand, index) => (
                <BrandComponent
                  key={index}
                  index={index}
                  brand={brand}
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

Brands.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.objectOf(PropTypes.string),
  brands: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({ brands: state.get('brands').brands });

export default connect(mapStateToProps)(Brands);

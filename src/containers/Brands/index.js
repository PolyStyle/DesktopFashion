import React, { Component, PropTypes } from 'react';
import { Table, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { connect } from 'react-redux';
import BrandComponent from './brandComponent';
import * as action from './action';


class Brands extends Component {
  // Fetching data method for both server/client side rendering
  static fetchData(dispatch) {
    return Promise.all([
      dispatch(action.fetchDataIfNeeded()),
    ]);
  }
  static addTag(dispatch) {
    return Promise.all([
      dispatch(action.addTag()),
    ]);
  }
  static removeTag(dispatch, index) {
    return Promise.all([
      dispatch(action.removeTag(index)),
    ]);
  }
  static deleteTag(dispatch, id, index) {
    return Promise.all([
      dispatch(action.deleteTag(id, index)),
    ]);
  }

  static updateTag(dispatch, id, value) {
    return Promise.all([
      dispatch(action.updateTag(id, value)),
    ]);
  }
  static createTag(dispatch, index, value) {
    // the index is the position in the current tags redux. Not the id on db.
    return Promise.all([
      dispatch(action.createTag(index, value)),
    ]);
  }
  constructor() {
    super();
    this.addTagHandler = this.addTagHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    // Fetching data for client side rendering
    Brands.fetchData(dispatch, params);
  }
  componentWillReceiveProps(nextProps) {
    console.log('new PROPS');
    console.log(nextProps);
  }
  addTagHandler() {
    const { dispatch } = this.props;
    Brands.addTag(dispatch);
  }

  saveHandler(tag) {
    const { dispatch } = this.props;
    const newValue = tag.tempValue;
    const id = tag.id;
    if (id) {
      // This is an existing tag, just update it.
      Brands.updateTag(dispatch, id, newValue);
    } else {
      // This is a new tag, create it.
      Brands.createTag(dispatch, tag.index, newValue);
    }
  }

  deleteHandler(tag) {
    const { dispatch } = this.props;
    const id = tag.id;
    if (id) {
      // This is an existing tag, just update it.
      Brands.deleteTag(dispatch, id, tag.index);
    } else {
      // This is a new tag, create it.
      Brands.removeTag(dispatch, tag.index);
    }
  }

  render() {
    if (this.props.brands) {
      return (
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Brands</BreadcrumbItem>
            <BreadcrumbItem active>
              <Button color="success" onClick={this.addTagHandler} size="sm">Add Tags</Button>
            </BreadcrumbItem>
          </Breadcrumb>
          <Table striped size="sm">
            <thead>
              <tr>
                <th width="15%">id</th>
                <th width="50%">title</th>
                <th width="35%">edits</th>
              </tr>
            </thead>
            <tbody>
              {this.props.brands.map((tag, index) => (
                <BrandComponent
                  key={index}
                  index={index}
                  tag={tag}
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

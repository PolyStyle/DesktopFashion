import React, { Component, PropTypes } from 'react';
import { Table, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { connect } from 'react-redux';
import TagComponent from './tagComponent';
import * as action from './action';


class Tags extends Component {
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
    Tags.fetchData(dispatch, params);
  }
  componentWillReceiveProps(nextProps) {
    console.log('new PROPS');
    console.log(nextProps);
  }
  addTagHandler() {
    const { dispatch } = this.props;
    Tags.addTag(dispatch);
  }

  saveHandler(tag) {
    const { dispatch } = this.props;
    const newValue = tag.tempValue;
    const id = tag.id;
    if (id) {
      // This is an existing tag, just update it.
      Tags.updateTag(dispatch, id, newValue);
    } else {
      // This is a new tag, create it.
      Tags.createTag(dispatch, tag.index, newValue);
    }
  }

  deleteHandler(tag) {
    const { dispatch } = this.props;
    const id = tag.id;
    if (id) {
      // This is an existing tag, just update it.
      Tags.deleteTag(dispatch, id, tag.index);
    } else {
      // This is a new tag, create it.
      Tags.removeTag(dispatch, tag.index);
    }
  }

  render() {
    console.log(this.props);
    if (this.props.tags) {
      return (
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Tags</BreadcrumbItem>
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
              {this.props.tags.map((tag, index) => (
                <TagComponent
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

Tags.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.objectOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({ tags: state.get('tags').tags });

export default connect(mapStateToProps)(Tags);

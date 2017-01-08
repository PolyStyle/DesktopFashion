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

  constructor() {
    super();
    this.addTagHandler = this.addTagHandler.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    // Fetching data for client side rendering
    Tags.fetchData(dispatch, params);
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('PrevProps', prevProps);
    console.log('PrevState', prevState);
    console.log('PrevProps', this.props);
    console.log('PrevState', this.state);
  }
  addTagHandler() {
    const { dispatch } = this.props;
    Tags.addTag(dispatch);
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
          <Table striped>
            <thead>
              <tr>
                <th>id</th>
                <th>title</th>
                <th>edits</th>
              </tr>
            </thead>
            <tbody>
              {this.props.tags.map((tag, index) => (
                <TagComponent key={index} tag={tag} />
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

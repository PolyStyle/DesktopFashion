import React, { Component, PropTypes } from 'react';
import { Table, Button, Breadcrumb, BreadcrumbItem, Card, CardBlock,
  Container, Row, Col, Input } from 'reactstrap';
import { connect } from 'react-redux';
import UserComponent from './userComponent';
import * as action from './action';
import styles from './styles.css';
import Uploader from './../../components/Uploader';
import ScaledImage from './../../components/ScaledImage';

class Users extends Component {
  // Fetching data method for both server/client side rendering
  static fetchData(dispatch) {
    return Promise.all([
      dispatch(action.fetchDataIfNeeded()),
    ]);
  }
  static addUser(dispatch) {
    return Promise.all([
      dispatch(action.addUser()),
    ]);
  }
  static removeUser(dispatch, index) {
    return Promise.all([
      dispatch(action.removeUser(index)),
    ]);
  }
  static deleteUser(dispatch, id, index) {
    return Promise.all([
      dispatch(action.deleteUser(id, index)),
    ]);
  }

  static updateUser(dispatch, value) {
    return Promise.all([
      dispatch(action.updateUser(value)),
    ]);
  }
  static createUser(dispatch, index, value) {
    // the index is the position in the current tags redux. Not the id on db.
    return Promise.all([
      dispatch(action.createUser(index, value)),
    ]);
  }
  constructor() {
    super();
    this.state = {
      isEdited: false,
    };
    this.addUserHandler = this.addUserHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.deepEditHandler = this.deepEditHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.saveDetailedHandler = this.saveDetailedHandler.bind(this);
    this.imageUserAvatarUploadedHandler = this.imageUserAvatarUploadedHandler.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    // Fetching data for client side rendering
    Users.fetchData(dispatch, params);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.state.isEdited);
    if (this.state.isEdited) {
      const id = this.state.currentUser.id;
      let user = null;
      let i = 0;
      for (; i < nextProps.users.length; i += 1) {
        if (nextProps.users[i].id === id) {
          user = nextProps.users[i];
        }
      }
      if (!user) {
        return;
      }

      console.log('Next Props', nextProps);
      this.setState({
        currentUser: {
          ...user,
          tempValues: user,
        },
      });
    }
  }

  addUserHandler() {
    const { dispatch } = this.props;
    Users.addUser(dispatch);
  }

  saveHandler(user) {
    const { dispatch } = this.props;
    const newValue = user.tempValues;
    const id = user.id;
    if (id) {
      // This is an existing tag, just update it.
      Users.updateUser(dispatch, newValue);
    } else {
      // This is a new tag, create it.
      Users.createUser(dispatch, user.index, newValue);
    }
  }

  saveDetailedHandler() {
    const { dispatch } = this.props;
    const newUser = this.state.currentUser.tempValues;
    const id = newUser.id;
    const index = newUser.index;
    console.log('-------');
    console.log(index);
    console.log('-------');
    if (id) {
      // This is an existing user, just update it.
      Users.updateUser(dispatch, newUser);
    } else {
      // This is a new user, create it.
      Users.createUser(dispatch, index, newUser);
    }
  }

  deleteHandler(user) {
    const { dispatch } = this.props;
    const id = user.id;
    if (id) {
      // This is an existing tag, just update it.
      Users.deleteUser(dispatch, id, user.index);
    } else {
      // This is a new tag, create it.
      console.log('trying to remove user with index', user.index);
      Users.removeUser(dispatch, user.index);
    }
  }

  deepEditHandler(user) {
    this.setState({
      isEdited: true,
      currentUser: {
        ...user,
        tempValues: user,
      },
    });
  }

  handleChange(event) {
    this.setState({
      currentUser: {
        ...this.state.currentUser,
        tempValues: {
          ...this.state.currentUser.tempValues,
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

  imageUserAvatarUploadedHandler(file, response) {
    const responseObject = JSON.parse(response);
    this.setState({
      currentUser: {
        ...this.state.currentUser,
        tempValues: {
          ...this.state.currentUser.tempValues,
          ImageId: responseObject.id,
        },
      },
    });
  }

  render() {
    if (this.props.users) {
      return (
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Users</BreadcrumbItem>
            <BreadcrumbItem active>
              <Button color="success" onClick={this.addUserHandler} size="sm">Add User</Button>
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
                            <ScaledImage
                              styles={styles.avatar}
                              id={this.state.currentUser.ImageId}
                            />
                          </Col>
                          <Col>
                            <span> Upload avatar Image </span>
                            <Uploader
                              callBackFileUploaded={this.imageUserAvatarUploadedHandler}
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
                      <span> Display Name </span>
                      <Input
                        type="text"
                        size="sm"
                        placeholder={this.state.currentUser.displayName}
                        value={this.state.currentUser.tempValues.displayName}
                        onChange={this.handleChange}
                        name="displayName"
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
              {this.props.users.map((user, index) => (
                <UserComponent
                  key={index}
                  index={index}
                  user={user}
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

Users.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.objectOf(PropTypes.string),
  users: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({ users: state.get('users').users });

export default connect(mapStateToProps)(Users);

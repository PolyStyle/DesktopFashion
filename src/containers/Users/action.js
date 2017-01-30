export const USERS_REQUESTED = 'USERS_REQUESTED';
export const USERS_FAIL = 'USERS_FAIL';
export const USERS_RECEIVED = 'USERS_RECEIVED';
export const ADD_USER = 'ADD_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const CREATE_USER = 'CREATE_USER';
export const REMOVE_USER = 'REMOVE_USER';

const API_URL = 'http://localhost:3000/users/';

// Export this function for testing
export const fetchData = axios => (dispatch) => {
  dispatch({ type: USERS_REQUESTED });

  return axios.get(API_URL)
    .then((res) => {
      dispatch({ type: USERS_RECEIVED, data: res.data });
    })
    .catch((err) => {
      dispatch({ type: USERS_FAIL, err });
    });
};

/* istanbul ignore next */
export const addUser = () => (dispatch) => {
  dispatch({ type: ADD_USER });
};

export const updateUser = newUser => (dispatch, getState, axios) => {
  console.log('receiving the user action', newUser);
  const id = newUser.id;
  const endPoint = API_URL + id;
  return axios.put(endPoint, newUser)
  .then(() => {
    console.log('it went well!');
    dispatch({ type: UPDATE_USER, id, newUser });
  })
  .catch((err) => {
    console.log('there was an error');
    console.log(err);
    dispatch({ type: USERS_FAIL, err });
  });
};

export const createUser = (index, newUser) => (dispatch, getState, axios) => {
  console.log('Create a user');
  console.log(newUser, index);
  return axios.post(API_URL, newUser)
  .then((res) => {
    console.log('DONE, now lets update');
    dispatch({
      type: CREATE_USER,
      id: res.data.id,
      index,
      newUser: { ...newUser, id: res.data.id },
    });
  })
  .catch((err) => {
    console.log(err);
    dispatch({ type: USERS_FAIL, err });
  });
};

export const deleteUser = (id, index) => (dispatch, getState, axios) => {
  console.log('action received delete user invoked');
  const endPoint = API_URL + id;
  return axios.delete(endPoint)
  .then(() => {
    dispatch({ type: REMOVE_USER, index });
  })
  .catch((err) => {
    console.log(err);
    dispatch({ type: USERS_FAIL, err });
  });
};

export const removeUser = index => (dispatch) => {
  dispatch({ type: REMOVE_USER, index });
};
/* istanbul ignore next */
export const fetchDataIfNeeded = () => (dispatch, getState, axios) => {
  /* istanbul ignore next */
  dispatch(fetchData(axios));
};

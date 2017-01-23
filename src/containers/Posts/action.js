export const POSTS_REQUESTED = 'POSTS_REQUESTED';
export const POSTS_FAIL = 'POSTS_FAIL';
export const POSTS_RECEIVED = 'POSTS_RECEIVED';
export const ADD_POST = 'ADD_POST';
export const UPDATE_POST = 'UPDATE_POST';
export const CREATE_POST = 'CREATE_POST';
export const REMOVE_POST = 'REMOVE_POST';

const API_URL = 'http://localhost:3000/posts/';

// Export this function for testing
export const fetchData = axios => (dispatch) => {
  console.log('REQUESTING POSTS');
  dispatch({ type: POSTS_REQUESTED });

  return axios.get(API_URL)
    .then((res) => {
      dispatch({ type: POSTS_RECEIVED, data: res.data });
    })
    .catch((err) => {
      dispatch({ type: POSTS_FAIL, err });
    });
};

/* istanbul ignore next */
export const addPost = newPost => (dispatch, getState, axios) => {
  axios.post(API_URL, newPost)
  .then((res) => {
    dispatch({ type: ADD_POST, newPost: res.data });
  })
  .catch((err) => {
    dispatch({ type: POSTS_FAIL, err });
  });
};

export const updatePost = newPost => (dispatch, getState, axios) => {
  const id = newPost.id;
  const endPoint = API_URL + id;
  return axios.put(endPoint, newPost)
  .then(() => {
    dispatch({ type: UPDATE_POST, id, newPost });
  })
  .catch((err) => {
    dispatch({ type: POSTS_FAIL, err });
  });
};

export const createPost = (index, newPost) => (dispatch, getState, axios) => {
  axios.post(API_URL, newPost)
  .then((res) => {
    dispatch({
      type: CREATE_POST,
      id: res.data.id,
      index,
      newPost: { ...newPost, id: res.data.id },
    });
  })
  .catch((err) => {
    dispatch({ type: POSTS_FAIL, err });
  });
};

export const deletePost = (id, index) => (dispatch, getState, axios) => {
  const endPoint = API_URL + id;
  return axios.delete(endPoint)
  .then(() => {
    dispatch({ type: REMOVE_POST, index });
  })
  .catch((err) => {
    dispatch({ type: POSTS_FAIL, err });
  });
};

export const removePost = index => (dispatch) => {
  dispatch({ type: REMOVE_POST, index });
};
/* istanbul ignore next */
export const fetchDataIfNeeded = () => (dispatch, getState, axios) => {
  /* istanbul ignore next */
  dispatch(fetchData(axios));
};

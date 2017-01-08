export const TAGS_REQUESTED = 'TAGS_REQUESTED';
export const TAGS_FAIL = 'TAGS_FAIL';
export const TAGS_RECEIVED = 'TAGS_RECEIVED';
export const ADD_TAG = 'ADD_TAG';
export const UPDATE_TAG = 'UPDATE_TAG';
export const CREATE_TAG = 'CREATE_TAG';

const API_URL = 'http://localhost:3000/tags/';

// Export this function for testing
export const fetchData = axios => (dispatch) => {
  dispatch({ type: TAGS_REQUESTED });

  return axios.get(API_URL)
    .then((res) => {
      dispatch({ type: TAGS_RECEIVED, data: res.data });
    })
    .catch((err) => {
      dispatch({ type: TAGS_FAIL, err });
    });
};

/* istanbul ignore next */
export const addTag = () => (dispatch) => {
  dispatch({ type: ADD_TAG });
};

export const updateTag = (id, value) => (dispatch) => {
  dispatch({ type: UPDATE_TAG, id, value });
};

export const createTag = (index, value) => (dispatch, getState, axios) => {
  console.log('RECEIVING ');
  return axios.post(API_URL, {
    displayName: value,
  })
  .then((res) => {
    dispatch({ type: CREATE_TAG, id: res.data.id, index, value });
  })
  .catch((err) => {
    console.log(err);
    dispatch({ type: TAGS_FAIL, err });
  });
};

/* istanbul ignore next */
export const fetchDataIfNeeded = () => (dispatch, getState, axios) => {
  /* istanbul ignore next */
  dispatch(fetchData(axios));
};

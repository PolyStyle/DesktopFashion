export const TAGS_REQUESTED = 'TAGS_REQUESTED';
export const TAGS_FAIL = 'TAGS_FAIL';
export const TAGS_RECEIVED = 'TAGS_RECEIVED';
export const ADD_TAG = 'ADD_TAG';

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

/* istanbul ignore next */
export const fetchDataIfNeeded = () => (dispatch, getState, axios) => {
  /* istanbul ignore next */
  dispatch(fetchData(axios));
};

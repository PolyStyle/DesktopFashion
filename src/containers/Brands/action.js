export const BRANDS_REQUESTED = 'BRANDS_REQUESTED';
export const BRANDS_FAIL = 'BRANDS_FAIL';
export const BRANDS_RECEIVED = 'BRANDS_RECEIVED';
export const ADD_BRAND = 'ADD_BRAND';
export const UPDATE_BRAND = 'UPDATE_BRAND';
export const CREATE_BRAND = 'CREATE_BRAND';
export const REMOVE_BRAND = 'REMOVE_BRAND';

const API_URL = 'http://localhost:3000/brands/';

// Export this function for testing
export const fetchData = axios => (dispatch) => {
  dispatch({ type: BRANDS_REQUESTED });

  return axios.get(API_URL)
    .then((res) => {
      dispatch({ type: BRANDS_RECEIVED, data: res.data });
    })
    .catch((err) => {
      dispatch({ type: BRANDS_FAIL, err });
    });
};

/* istanbul ignore next */
export const addBrand = () => (dispatch) => {
  dispatch({ type: ADD_BRAND });
};

export const updateBrand = newBrand => (dispatch, getState, axios) => {
  console.log('receiving the brand action', newBrand);
  const id = newBrand.id;
  const endPoint = API_URL + id;
  return axios.put(endPoint, newBrand)
  .then(() => {
    console.log('it went well!');
    dispatch({ type: UPDATE_BRAND, id, newBrand });
  })
  .catch((err) => {
    console.log('there was an error');
    console.log(err);
    dispatch({ type: BRANDS_FAIL, err });
  });
};

export const createBrand = (index, newBrand) => (dispatch, getState, axios) => {
  console.log('Create a brand');
  console.log(newBrand, index);
  return axios.post(API_URL, newBrand)
  .then((res) => {
    console.log('DONE, now lets update');
    dispatch({
      type: CREATE_BRAND,
      id: res.data.id,
      index,
      newBrand: { ...newBrand, id: res.data.id },
    });
  })
  .catch((err) => {
    console.log(err);
    dispatch({ type: BRANDS_FAIL, err });
  });
};

export const deleteBrand = (id, index) => (dispatch, getState, axios) => {
  console.log('action received delete brand invoked');
  const endPoint = API_URL + id;
  return axios.delete(endPoint)
  .then(() => {
    dispatch({ type: REMOVE_BRAND, index });
  })
  .catch((err) => {
    console.log(err);
    dispatch({ type: BRANDS_FAIL, err });
  });
};

export const removeBrand = index => (dispatch) => {
  dispatch({ type: REMOVE_BRAND, index });
};
/* istanbul ignore next */
export const fetchDataIfNeeded = () => (dispatch, getState, axios) => {
  /* istanbul ignore next */
  dispatch(fetchData(axios));
};

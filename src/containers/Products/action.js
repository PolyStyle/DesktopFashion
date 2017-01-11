export const PRODUCTS_REQUESTED = 'PRODUCTS_REQUESTED';
export const PRODUCTS_FAIL = 'PRODUCTS_FAIL';
export const PRODUCTS_RECEIVED = 'PRODUCTS_RECEIVED';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';

const API_URL = 'http://localhost:3000/products/';

// Export this function for testing
export const fetchData = axios => (dispatch) => {
  dispatch({ type: PRODUCTS_REQUESTED });

  return axios.get(API_URL)
    .then((res) => {
      dispatch({ type: PRODUCTS_RECEIVED, data: res.data });
    })
    .catch((err) => {
      dispatch({ type: PRODUCTS_FAIL, err });
    });
};

/* istanbul ignore next */
export const addProduct = () => (dispatch) => {
  dispatch({ type: ADD_PRODUCT });
};

export const updateProduct = newProduct => (dispatch, getState, axios) => {
  const id = newProduct.id;
  const endPoint = API_URL + id;
  return axios.put(endPoint, newProduct)
  .then(() => {
    console.log('it went well!');
    dispatch({ type: UPDATE_PRODUCT, id, newProduct });
  })
  .catch((err) => {
    console.log('there was an error');
    console.log(err);
    dispatch({ type: PRODUCTS_FAIL, err });
  });
};

export const createProduct = (index, newProduct) => (dispatch, getState, axios) => {
  axios.post(API_URL, newProduct)
  .then((res) => {
    console.log('DONE, now lets update');
    dispatch({
      type: CREATE_PRODUCT,
      id: res.data.id,
      index,
      newProduct: { ...newProduct, id: res.data.id },
    });
  })
  .catch((err) => {
    console.log(err);
    dispatch({ type: PRODUCTS_FAIL, err });
  });
};

export const deleteProduct = (id, index) => (dispatch, getState, axios) => {
  console.log('action received delete brand invoked');
  const endPoint = API_URL + id;
  return axios.delete(endPoint)
  .then(() => {
    dispatch({ type: REMOVE_PRODUCT, index });
  })
  .catch((err) => {
    console.log(err);
    dispatch({ type: PRODUCTS_FAIL, err });
  });
};

export const removeProduct = index => (dispatch) => {
  dispatch({ type: REMOVE_PRODUCT, index });
};
/* istanbul ignore next */
export const fetchDataIfNeeded = () => (dispatch, getState, axios) => {
  /* istanbul ignore next */
  dispatch(fetchData(axios));
};

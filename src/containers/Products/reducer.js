import { Map, fromJS } from 'immutable';
import {
  PRODUCTS_RECEIVED,
  PRODUCTS_REQUESTED,
  PRODUCTS_FAIL,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  CREATE_PRODUCT,
  REMOVE_PRODUCT,
} from './action';

const initialState = Map({
  products: [],
});


export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PRODUCT: {
      const products = state.products;
      let currentIndex = -1;
      let i = products.length - 1;
      for (; i >= 0; i -= 1) {
        if (products[i].id === action.id) {
          currentIndex = i;
        }
      }

      if (currentIndex === -1) {
        return state;
      }

      return Object.assign({}, state, {
        products:
        state.products.slice(0, currentIndex)
        .concat([action.newProduct])
        .concat(state.products.slice(currentIndex + 1)),
      });
    }
    case CREATE_PRODUCT:
      return Object.assign({}, state, {
        products:
        state.products.slice(0, action.index)
        .concat([action.newProduct])
        .concat(state.products.slice(action.index + 1)),
      });
    case REMOVE_PRODUCT: {
      return Object.assign({}, state, {
        products:
        state.products.slice(0, action.index)
        .concat(state.products.slice(action.index + 1)),
      });
    }
    case PRODUCTS_RECEIVED:
      return {
        ...state,
        products: action.data,
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: state.products.concat(action.newProduct),
      };
    case PRODUCTS_REQUESTED:
      return {
        ...state,
      };
    case PRODUCTS_FAIL:
      return {
        ...state,
        err: fromJS(action.err),
      };
    default:
      return state;
  }
};

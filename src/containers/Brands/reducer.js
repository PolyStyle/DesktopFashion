import { fromJS } from 'immutable';
import {
  BRANDS_RECEIVED,
  BRANDS_REQUESTED,
  BRANDS_FAIL,
  ADD_BRAND,
  UPDATE_BRAND,
  CREATE_BRAND,
  REMOVE_BRAND,
} from './action';

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_BRAND: {
      const brands = state.brands;
      let currentIndex = -1;
      let i = brands.length - 1;
      for (; i >= 0; i -= 1) {
        if (brands[i].id === action.id) {
          currentIndex = i;
        }
      }
      if (currentIndex === -1) {
        return state;
      }
      return Object.assign({}, state, {
        brands:
        state.brands.slice(0, currentIndex)
        .concat([action.newBrand])
        .concat(state.brands.slice(currentIndex + 1)),
      });
    }
    case CREATE_BRAND:
      return Object.assign({}, state, {
        brands:
        state.brands.slice(0, action.index)
        .concat([action.newBrand])
        .concat(state.brands.slice(action.index + 1)),
      });
    case REMOVE_BRAND: {
      return Object.assign({}, state, {
        brands:
        state.brands.slice(0, action.index)
        .concat(state.brands.slice(action.index + 1)),
      });
    }
    case BRANDS_RECEIVED:
      return {
        ...state,
        brands: action.data,
      };
    case ADD_BRAND:
      return {
        ...state,
        brands: state.brands.concat({ displayName: 'Test' }),
      };
    case BRANDS_REQUESTED:
      return {
        ...state,
        readyState: BRANDS_REQUESTED,
      };
    case BRANDS_FAIL:
      return {
        ...state,
        readyState: BRANDS_FAIL,
        err: fromJS(action.err),
      };
    default:
      return state;
  }
};

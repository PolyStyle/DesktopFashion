import { fromJS } from 'immutable';
import {
  PRODUCTS_RECEIVED,
  PRODUCTS_REQUESTED,
  PRODUCTS_FAIL,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  CREATE_PRODUCT,
  REMOVE_PRODUCT,
} from './action';
import {
  TAGS_RECEIVED,
} from './../Tags/action';

export default (state = {}, action) => {
  console.log(action.type);
  switch (action.type) {
    case UPDATE_PRODUCT: {
      console.log('received the redux call');
      const products = state.products;
      let currentIndex = -1;
      let i = products.length - 1;
      for (; i >= 0; i -= 1) {
        if (products[i].id === action.id) {
          currentIndex = i;
        }
      }
      console.log('REDUX ', currentIndex);
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
        products: state.products.concat({
          display: ' test',
          picture: 'https://kickz.akamaized.net/en/media/images/p/600/nike-W_INTERNATIONALIST_PRM-CL_GREY_ANTHRCT_PR_PLTNM_WHITE-1.jpg',
          Tags: [],
        }),
      };
    case PRODUCTS_REQUESTED:
      return {
        ...state,
        readyState: PRODUCTS_REQUESTED,
      };
    case PRODUCTS_FAIL:
      return {
        ...state,
        readyState: PRODUCTS_FAIL,
        err: fromJS(action.err),
      };
    case TAGS_RECEIVED:
      return {
        ...state,
        tags: action.data,
      };
    default:
      return state;
  }
};

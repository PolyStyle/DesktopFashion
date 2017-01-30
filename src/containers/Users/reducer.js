import { fromJS } from 'immutable';
import {
  USERS_RECEIVED,
  USERS_REQUESTED,
  USERS_FAIL,
  ADD_USER,
  UPDATE_USER,
  CREATE_USER,
  REMOVE_USER,
} from './action';

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_USER: {
      const users = state.users;
      let currentIndex = -1;
      let i = users.length - 1;
      for (; i >= 0; i -= 1) {
        if (users[i].id === action.id) {
          currentIndex = i;
        }
      }
      if (currentIndex === -1) {
        return state;
      }
      return Object.assign({}, state, {
        users:
        state.users.slice(0, currentIndex)
        .concat([action.newUser])
        .concat(state.users.slice(currentIndex + 1)),
      });
    }
    case CREATE_USER:
      return Object.assign({}, state, {
        users:
        state.users.slice(0, action.index)
        .concat([action.newUser])
        .concat(state.users.slice(action.index + 1)),
      });
    case REMOVE_USER: {
      return Object.assign({}, state, {
        users:
        state.users.slice(0, action.index)
        .concat(state.users.slice(action.index + 1)),
      });
    }
    case USERS_RECEIVED:
      return {
        ...state,
        users: action.data,
      };
    case ADD_USER:
      return {
        ...state,
        users: state.users.concat({ displayName: 'Test' }),
      };
    case USERS_REQUESTED:
      return {
        ...state,
        readyState: USERS_REQUESTED,
      };
    case USERS_FAIL:
      return {
        ...state,
        readyState: USERS_FAIL,
        err: fromJS(action.err),
      };
    default:
      return state;
  }
};

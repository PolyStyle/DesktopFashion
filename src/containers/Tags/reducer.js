import { fromJS } from 'immutable';
import {
  TAGS_RECEIVED,
  TAGS_REQUESTED,
  TAGS_FAIL,
  ADD_TAG,
  UPDATE_TAG,
  CREATE_TAG,
  REMOVE_TAG,
} from './action';

export default (state = {}, action) => {
  console.log(action.type);
  switch (action.type) {
    case UPDATE_TAG: {
      const tags = state.tags;
      let currentIndex = -1;
      let i = tags.length - 1;
      for (; i >= 0; i -= 1) {
        if (tags[i].id === action.id) {
          currentIndex = i;
        }
      }
      if (currentIndex === -1) {
        return state;
      }
      return Object.assign({}, state, {
        tags:
        state.tags.slice(0, currentIndex)
        .concat([{
          displayName: action.value,
        }])
        .concat(state.tags.slice(currentIndex + 1)),
      });
    }
    case CREATE_TAG:
      return Object.assign({}, state, {
        tags:
        state.tags.slice(0, action.index)
        .concat([{
          displayName: action.value,
          id: action.id,
        }])
        .concat(state.tags.slice(action.index + 1)),
      });
    case REMOVE_TAG: {
      return Object.assign({}, state, {
        tags:
        state.tags.slice(0, action.index)
        .concat(state.tags.slice(action.index + 1)),
      });
    }
    case TAGS_RECEIVED:
      return {
        ...state,
        tags: action.data,
      };
    case ADD_TAG:
      return {
        ...state,
        tags: state.tags.concat({ displayName: 'Test' }),
      };
    case TAGS_REQUESTED:
      return {
        ...state,
        readyState: TAGS_REQUESTED,
      };
    case TAGS_FAIL:
      return {
        ...state,
        readyState: TAGS_FAIL,
        err: fromJS(action.err),
      };
    default:
      return state;
  }
};

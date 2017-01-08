import { fromJS } from 'immutable';
import {
  TAGS_RECEIVED,
  TAGS_REQUESTED,
  TAGS_FAIL,
  ADD_TAG,
  UPDATE_TAG,
  CREATE_TAG,
} from './action';

export default (state = {}, action) => {
  console.log(action.type);
  switch (action.type) {
    case UPDATE_TAG:
      return state;
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

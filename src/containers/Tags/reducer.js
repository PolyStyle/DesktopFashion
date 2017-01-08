import { fromJS } from 'immutable';
import {
  TAGS_RECEIVED,
  TAGS_REQUESTED,
  TAGS_FAIL,
  ADD_TAG,
} from './action';

export default (state = {}, action) => {
  console.log(action.type);
  switch (action.type) {
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

import { Map, fromJS } from 'immutable';
import {
  POSTS_RECEIVED,
  POSTS_REQUESTED,
  POSTS_FAIL,
  ADD_POST,
  UPDATE_POST,
  CREATE_POST,
  REMOVE_POST,
} from './action';

const initialState = Map({
  posts: [],
});


export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_POST: {
      const posts = state.posts;
      let currentIndex = -1;
      let i = posts.length - 1;
      for (; i >= 0; i -= 1) {
        if (posts[i].id === action.id) {
          currentIndex = i;
        }
      }

      if (currentIndex === -1) {
        return state;
      }

      return Object.assign({}, state, {
        posts:
        state.posts.slice(0, currentIndex)
        .concat([action.newPost])
        .concat(state.posts.slice(currentIndex + 1)),
      });
    }
    case CREATE_POST:
      return Object.assign({}, state, {
        posts:
        state.posts.slice(0, action.index)
        .concat([action.newPost])
        .concat(state.posts.slice(action.index + 1)),
      });
    case REMOVE_POST: {
      return Object.assign({}, state, {
        posts:
        state.posts.slice(0, action.index)
        .concat(state.posts.slice(action.index + 1)),
      });
    }
    case POSTS_RECEIVED:
      return {
        ...state,
        posts: action.data,
      };
    case ADD_POST:
      return {
        ...state,
        posts: state.posts.concat(action.newPost),
      };
    case POSTS_REQUESTED:
      return {
        ...state,
      };
    case POSTS_FAIL:
      return {
        ...state,
        err: fromJS(action.err),
      };
    default:
      return state;
  }
};

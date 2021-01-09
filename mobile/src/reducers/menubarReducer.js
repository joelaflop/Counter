import {PAGE_CHANGE} from '../constants';

const initialState = {
  page: 0,
};

const menubarReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAGE_CHANGE:
      return {
        ...state,
        page: action.payload,
      };
    default:
      return state;
  }
};
export default menubarReducer;

import {DATA_PAGE_CHANGE} from '../constants';

const initialState = {
  page: 0,
};

const dataPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case DATA_PAGE_CHANGE:
      return {
        ...state,
        page: action.payload,
      };
    default:
      return state;
  }
};
export default dataPageReducer;

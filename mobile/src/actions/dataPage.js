import {DATA_PAGE_CHANGE} from '../constants';

export function changePage(page) {
  return {
    type: DATA_PAGE_CHANGE,
    payload: page,
  };
}

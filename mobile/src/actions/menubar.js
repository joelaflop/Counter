import {PAGE_CHANGE} from '../constants';

export function changePage(page) {
  return {
    type: PAGE_CHANGE,
    payload: page,
  };
}

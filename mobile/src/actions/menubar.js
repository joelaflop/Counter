import {COUNTER_CHANGE} from '../constants';
import {PAGE_CHANGE} from '../constants';

export function changeCount(count) {
  return {
    type: COUNTER_CHANGE,
    payload: count,
  };
}

export function changePage(page) {
  return {
    type: PAGE_CHANGE,
    payload: page,
  };
}

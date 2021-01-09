import {createStore, combineReducers} from 'redux';
import countReducer from '../reducers/countReducer';
import menubarReducer from '../reducers/menubarReducer';

const rootReducer = combineReducers({
  counter: countReducer,
  menubar: menubarReducer,
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;

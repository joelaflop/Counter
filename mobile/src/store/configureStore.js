import {createStore, combineReducers} from 'redux';
import countReducer from '../reducers/countReducer';
import menubarReducer from '../reducers/menubarReducer';
import dataPageReducer from '../reducers/dataPageReducer';
import nowPlayingReducer from '../reducers/nowPlayingReducer';

const rootReducer = combineReducers({
  counter: countReducer,
  menubar: menubarReducer,
  dataPage: dataPageReducer,
  nowPlaying: nowPlayingReducer,
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;

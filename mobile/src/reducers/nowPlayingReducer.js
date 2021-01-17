import {NOW_PLAYING_CHANGE} from '../constants';

const initialState = {
  currentlyPlaying: false,
  song: null,
};

const nowPlayingReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOW_PLAYING_CHANGE:
      return {
        ...state,
        currentlyPlaying: action.payload.currentlyPlaying,
        song: action.payload.song,
      };
    default:
      return state;
  }
};
export default nowPlayingReducer;

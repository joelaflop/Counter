import {NOW_PLAYING_CHANGE} from '../constants';

export function flopNowPlaying(song) {
  return {
    type: NOW_PLAYING_CHANGE,
    payload: {song: song, currentlyPlaying: song ? true : false},
  };
}

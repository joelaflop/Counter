import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button,
  FlatList,
} from 'react-native';

import {historyItem} from './historyItem';

const DATA = [
  {
    id: 'lmao0',
    title: '0th song has a really long namen',
    album: 'album',
    artist: 'artist',
    time: '59 minutes ago',
  },
  {
    id: 'lmao',
    title: 'first song has a really long namen',
    album: 'album',
    artist: 'artist',
    time: '60 minutes ago',
  },
  {
    id: 'lmao1',
    title: 'second song',
    album: 'album',
    artist: 'artist',
    time: '60 minutes ago',
  },
  {
    id: 'lmao2',
    title: 'third song',
    album: 'album',
    artist: 'artist',
    time: '60 minutes ago',
  },
  {
    id: 'lmao3',
    title: 'fourth song',
    album: 'album',
    artist: 'artist',
    time: '365 days ago',
  },
  {
    id: 'lmao4',
    title: 'fifth song',
    album: 'album',
    artist: 'artist',
    time: '365 days ago',
  },
  {
    id: 'lmao5',
    title: 'third song',
    album: 'album',
    artist: 'artist',
    time: '60 minutes ago',
  },
  {
    id: 'lmao6',
    title: 'third song',
    album: 'album',
    artist: 'artist',
    time: '60 minutes ago',
  },
  {
    id: 'lmao7',
    title: 'third song',
    album: 'album',
    artist: 'artist',
    time: '60 minutes ago',
  },
  {
    id: 'lmao8',
    title: 'last song',
    album: 'album',
    artist: 'artist',
    time: '60 minutes ago',
  },
];

function historyMainScreen() {
  return (
    <FlatList
      data={DATA}
      renderItem={historyItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default historyMainScreen;

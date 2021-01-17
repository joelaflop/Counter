import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {flopNowPlaying} from '../../actions/flopNowPlaying';

import TopBar from '../topBar';

const song = {
  id: 'lmao',
  title: 'first song has a really long namen',
  album: 'my twisted weiners',
  artist: 'kanye penis',
  time: '60 minutes ago',
};

function toggleNowPlaying(props) {
  if (props.userIsPlayingSomething) {
    props.flopNowPlaying(null);
  } else {
    props.flopNowPlaying(song);
  }
}

function HomeScreen(props) {
  return (
    <View style={{flex: 13}}>
      <Text>Home Screen</Text>
      <Button
        title="nowplayingflop"
        onPress={() => {
          toggleNowPlaying(props);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 100,
    backgroundColor: 'gray',
  },
});

const mapStateToProps = (state) => {
  return {
    userIsPlayingSomething: state.nowPlaying.currentlyPlaying,
  };
};

const ActionCreators = Object.assign({}, {flopNowPlaying});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

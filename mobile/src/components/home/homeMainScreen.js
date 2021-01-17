import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';

import {flopNowPlaying} from '../../actions/flopNowPlaying';

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

function homeMainScreen(props) {
  return (
    <>
      <Text>Home Screen</Text>
      <Button
        title="nowplayingflop"
        onPress={() => {
          toggleNowPlaying(props);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({});

const mapStateToProps = (state) => {
  return {
    userIsPlayingSomething: state.nowPlaying.currentlyPlaying,
  };
};

const ActionCreators = Object.assign({}, {flopNowPlaying});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(homeMainScreen);

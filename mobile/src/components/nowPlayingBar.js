import React, {Component} from 'react';
import {StyleSheet, Pressable, Text, View, Button, Image} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';

import {useNavigation} from '@react-navigation/native';

import {GRAY} from '../assets/colors';

const NowPlayingBar = (props) => {
  const navigation = useNavigation();
  if (props.userIsPlayingSomething) {
    return (
      <Pressable
        style={styles.bar}
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <View>
          <Image
            style={styles.albumCover}
            source={require('../assets/tree.png')}
          />
        </View>
        <View style={styles.textInfo}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: 'rgb(255, 255, 255)',
            }}>
            {props.song.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 10,
              color: 'rgb(230, 230, 230)',
            }}>
            {props.song.artist}
          </Text>
        </View>
      </Pressable>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    maxHeight: 50,
    backgroundColor: GRAY,
    // position: 'absolute',
    // bottom: 0,
  },
  albumCover: {
    height: 50,
    width: 50,
  },
  textInfo: {
    flex: 3,
    left: 5,
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    userIsPlayingSomething: state.nowPlaying.currentlyPlaying,
    song: state.nowPlaying.song,
  };
};

const ActionCreators = Object.assign({}, {});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingBar);

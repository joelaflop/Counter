import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button,
  Image,
  Pressable,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';

import {useNavigation} from '@react-navigation/native';

import {changePage} from '../actions/menubar';

import {TOP_BAR_HEIGHT} from '../assets/constants';

const TopBar = (props) => {
  return (
    <View style={styles.topBar}>
      <Pressable
        onPress={() => {
          // props.changePage(4);
          props.navigation.current?.navigate('User');
        }}>
        <Image style={styles.prof} source={require('../assets/tree.png')} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: TOP_BAR_HEIGHT,
    backgroundColor: 'gray',
    width: '100%',
    // position: 'absolute',
    // top: 0,
    // borderWidth: 1,
  },
  prof: {
    position: 'absolute',
    top: 40,
    right: 20,
    height: 25,
    width: 25,
  },
});

const mapStateToProps = (state) => {
  return {
    page: state.menubar.page,
  };
};

const ActionCreators = Object.assign({}, {changePage});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);

import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Pressable,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';

import NowPlayingBar from './nowPlayingBar';
import {changePage} from '../actions/menubar';

import {GRAY} from '../assets/colors';

const menubar = (props) => {
  return (
    <View style={styles.bar}>
      <Pressable onPress={() => props.changePage(0)}>
        <Text style={styles.buttonText}>Home</Text>
      </Pressable>
      <Pressable onPress={() => props.changePage(1)}>
        <Text style={styles.buttonText}>History</Text>
      </Pressable>
      <Pressable onPress={() => props.changePage(2)}>
        <Text style={styles.buttonText}>Data</Text>
      </Pressable>
      <Pressable onPress={() => props.changePage(3)}>
        <Text style={styles.buttonText}>Counter</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: GRAY,
    borderTopColor: 'black',
    borderTopWidth: 0.3,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    marginTop: 5,
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

export default connect(mapStateToProps, mapDispatchToProps)(menubar);

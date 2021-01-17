import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';

import {flopNowPlaying} from '../../actions/flopNowPlaying';

import TopBar from '../topBar';

import NowPlayingBar from '../nowPlayingBar';

import homeMainScreen from './homeMainScreen';

const HomeStack = createStackNavigator();

function HomeScreen(props) {
  return (
    <View style={{flex: 13}}>
      <TopBar />
      <HomeStack.Navigator>
        <HomeStack.Screen
          name="homeHome"
          component={homeMainScreen}
          options={{
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerTitle: null,
          }}
        />
      </HomeStack.Navigator>
      <NowPlayingBar />
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
  return {};
};

const ActionCreators = Object.assign({}, {});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';

import DataHome from './dataHome/dataHome';
import Counts from './counts/counts';
import ArtistsOverTime from './artistsOverTime/artistsOverTime';

import NowPlayingBar from '../nowPlayingBar';
import TopBar from '../topBar';

function headerTest() {
  return HeaderBackButton;
}

const DataStack = createStackNavigator();

function DataScreen() {
  return (
    <View style={{flex: 13}}>
      <TopBar />
      <DataStack.Navigator>
        <DataStack.Screen
          name="DataHome"
          component={DataHome}
          options={{
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerTitle: null,
          }}
        />
        <DataStack.Screen
          name="Counts"
          component={Counts}
          options={{
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerTitle: null,
          }}
        />
        <DataStack.Screen
          name="ArtistsOverTime"
          component={ArtistsOverTime}
          options={{
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerTitle: null,
          }}
        />
      </DataStack.Navigator>
      <NowPlayingBar />
    </View>
  );
}

const styles = StyleSheet.create({
  green: {
    width: '100%',
    backgroundColor: 'lightgreen',
  },
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DataScreen);

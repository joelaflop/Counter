import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';

import NowPlayingBar from '../nowPlayingBar';
import TopBar from '../topBar';

const ProfileStack = createStackNavigator();

function profileMainScreen(props) {
  return (
    <>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
      <Text>profile Screen</Text>
    </>
  );
}

function ProfileScreen(props) {
  return (
    <View style={{flex: 1}}>
      <TopBar />
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name="profileHome"
          component={profileMainScreen}
          options={{
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerTitle: null,
          }}
        />
      </ProfileStack.Navigator>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local

 *TODO: move 'mainscreens' into own components and connect to redux 
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {connect, useSelector, shallowEqual} from 'react-redux';
import {bindActionCreators} from 'redux';

import HomeScreen from './src/components/home/home';
import ProfileScreen from './src/components/profile/profile';
import {HistoryScreen} from './src/components/history/history';
import DataScreen from './src/components/data/data';

import Menubar from './src/components/menubar';
import NowPlayingBar from './src/components/nowPlayingBar';
import TopBar from './src/components/topBar';

import {DARK_GRAY} from './src/assets/colors';

import {useNavigation} from '@react-navigation/native';

// import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'History') {
                iconName = focused ? 'md-time' : 'md-time';
              } else if (route.name === 'Data') {
                iconName = focused ? 'analytics' : 'analytics';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Data" component={DataScreen} />
          <Tab.Screen name="User" component={ProfileScreen} />
          {/* add a screen for now playing screen - on nowplayingbar click */}
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainScreen: {
    flex: 14,
    width: '100%',
    backgroundColor: DARK_GRAY,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  testImg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 50,
    width: 50,
  },
});

const mapStateToProps = (state) => {
  return {
    userIsPlayingSomething: state.nowPlaying.userIsPlayingSomething,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

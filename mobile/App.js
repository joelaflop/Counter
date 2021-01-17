/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {connect, useSelector, shallowEqual} from 'react-redux';
import {bindActionCreators} from 'redux';

import Counter from './src/components/counter';
import HomeScreen from './src/components/home/homeScreen';
import ProfileScreen from './src/components/profile/profileScreen';
import {HistoryScreen} from './src/components/history/historyScreen';
import DataScreen from './src/components/data/data';
import Menubar from './src/components/menubar';
import NowPlayingBar from './src/components/nowPlayingBar';

import TopBar from './src/components/topBar';

import {DARK_GRAY} from './src/assets/colors';

import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function App() {
  const navigationRef = React.useRef(null);
  return (
    <NavigationContainer ref={navigationRef}>
      <TopBar navigation={navigationRef} />
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Data" component={DataScreen} />
        <Tab.Screen name="Counter" component={Counter} />
        <Tab.Screen name="User" component={ProfileScreen} />
        {/* add a screen for now playing screen - on nowplayingbar click */}
      </Tab.Navigator>
      <NowPlayingBar navigation={navigationRef} />
    </NavigationContainer>
  );
}

// return (
//   <View style={styles.app}>
//     <View style={styles.mainScreen}>
//       <TopBar />
//       {this.props.page === 0 ? (
//         <HomeScreen />
//       ) : this.props.page === 1 ? (
//         <HistoryScreen />
//       ) : this.props.page === 2 ? (
//         <DataScreen />
//       ) : this.props.page === 3 ? (
//         <Counter />
//       ) : this.props.page === 4 ? (
//         <ProfileScreen />
//       ) : (
//         <Text> nonexistent screen </Text>
//       )}
//       <NowPlayingBar />
//     </View>
//     <Menubar />
//   </View>
// );

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

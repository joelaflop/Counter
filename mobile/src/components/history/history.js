import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button,
  FlatList,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';

import {TOP_BAR_HEIGHT} from '../../assets/constants';

import NowPlayingBar from '../nowPlayingBar';
import TopBar from '../topBar';
import historyMainScreen from './historyMainScreen';

const HistoryStack = createStackNavigator();

export function HistoryScreen() {
  return (
    <View style={{flex: 13}}>
      <TopBar />
      <HistoryStack.Navigator>
        <HistoryStack.Screen
          name="historyHome"
          component={historyMainScreen}
          options={{
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerTitle: null,
          }}
        />
      </HistoryStack.Navigator>
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

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {connect, useSelector, shallowEqual} from 'react-redux';
import {bindActionCreators} from 'redux';

import Counter from './src/components/counter';
import {HomeScreen} from './src/components/home/homeScreen';
import {DataScreen} from './src/components/data/data';
import Menubar from './src/components/menubar';

const Stack = createStackNavigator();

class App extends Component {
  test() {
    console.log(this.state);
    console.log(this.props);
  }

  render() {
    let b = true;
    return (
      <View style={styles.app}>
        <View style={styles.container}>
          {this.props.page === 0 ? (
            <HomeScreen />
          ) : this.props.page === 1 ? (
            <Text>history</Text>
          ) : this.props.page === 2 ? (
            <DataScreen />
          ) : (
            <Counter />
          )}
        </View>
        <Menubar></Menubar>
      </View>
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
  container: {
    flex: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    page: state.menubar.page,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

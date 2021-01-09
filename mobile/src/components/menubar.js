import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Button} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';

import {changePage} from '../actions/menubar';

const menubar = (props) => {
  return (
    <View style={styles.bar}>
      <View style={styles.button}>
        <Button title="Home" onPress={() => props.changePage(0)} />
      </View>
      <View style={styles.button}>
        <Button title="History" onPress={() => props.changePage(1)} />
      </View>
      <View style={styles.button}>
        <Button title="Data" onPress={() => props.changePage(2)} />
      </View>
      <View style={styles.button}>
        <Button title="test" onPress={() => props.changePage(3)} />
      </View>
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
    backgroundColor: 'gray',
  },
  button: {
    flex: 1,
    // alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'lightblue',
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

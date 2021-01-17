import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

function ProfileScreen(props) {
  return (
    <View style={{flex: 1}}>
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

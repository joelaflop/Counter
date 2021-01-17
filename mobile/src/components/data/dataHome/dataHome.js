import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

function DataHome({navigation}) {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'lightred',
        }}>
        <Text>Data Home Screen</Text>
        <Button title="Counts" onPress={() => navigation.push('Counts')} />
        <Button
          title="artists over time"
          onPress={() => navigation.push('ArtistsOverTime')}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DataHome);

{
  /* <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      /> */
}

import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';

export function historyItem(props) {
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.albumCover}
          source={require('../../assets/tree.png')}
        />
      </View>
      <View style={{flex: 6, flexDirection: 'row'}}>
        <View
          style={{flex: 4, justifyContent: 'space-between', paddingLeft: 5}}>
          <Text numberOfLines={1} style={{fontSize: 19, color: 'white'}}>
            {props.item.title}
          </Text>
          <Text numberOfLines={1} style={{fontSize: 14, color: 'white'}}>
            {props.item.album}
          </Text>
          <Text numberOfLines={1} style={{fontSize: 17, color: 'white'}}>
            {props.item.artist}
          </Text>
        </View>
        <View style={{flex: 2, alignItems: 'flex-end', marginTop: 1}}>
          <Text style={{textAlign: 'right', color: 'white'}}>
            {props.item.time}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    padding: 5,
    // backgroundColor: 'yellow',
  },
  albumCover: {
    height: 80,
    width: 80,
  },
});

import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Button} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {changeCount} from '../actions/counts';

const REACT_VERSION = React.version;

class Counter extends Component {
  decrementCount() {
    this.props.changeCount(this.props.count - 1);
  }
  incrementCount() {
    this.props.changeCount(this.props.count + 1);
  }
  test() {}

  render() {
    const {count} = this.props;
    return (
      <View style={styles.container}>
        <Button title="increment" onPress={() => this.incrementCount()} />
        <Text>{count}</Text>
        <Button title="decrement" onPress={() => this.decrementCount()} />
        {/* <Button title="test" onPress={() => this.test()} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    count: state.counter.count,
  };
};

const ActionCreators = Object.assign({}, {changeCount});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  divider: {
    width: Layout.window.width + 100,
    left: -50,
    marginVertical: 20,
  },
});

const Divider = ({ color, height }) => (
  <View
    style={[
      styles.divider,
      {
        borderBottomColor: color,
        borderBottomWidth: height,
      },
    ]}
  />
);

Divider.defaultProps = {
  color: '#b3b3b3',
  height: 1,
};

export default Divider;

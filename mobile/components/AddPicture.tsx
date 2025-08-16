import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  root: {
    width: 100,
    height: 100,
    backgroundColor: '#efefef',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type AddPictureProps = {
  onPress?: () => void;
};

const AddPicture = ({ onPress }: AddPictureProps) => (
  <Pressable onPress={onPress}>
    <View style={styles.root}>
      <FontAwesome name="plus" size={50} color="#d1d1d1" />
    </View>
  </Pressable>
);

AddPicture.defaultProps = {
  onPress: () => {},
};

export default AddPicture;

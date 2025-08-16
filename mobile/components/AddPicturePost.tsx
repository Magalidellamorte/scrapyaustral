import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './Button';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

type AddPictureProps = {
  onPress?: () => void;
  label: string;
};

const AddPicturePost = ({ onPress, label }: AddPictureProps) => (
  <View style={styles.root}>
    <Button type="secondary" onPress={onPress}>
      {label || 'Subir foto'}
    </Button>
  </View>
);

AddPicturePost.defaultProps = {
  onPress: () => {},
};

export default AddPicturePost;

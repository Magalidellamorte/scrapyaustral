/* eslint-disable global-require */
import React from 'react';
import { StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({});
type RatingBarsProps = {
  id?: number;
  style?: any;
};

function RatingImg({ id, style }: RatingBarsProps) {
  let image;
  if (id === 0) {
    image = require('../../assets/images/emojis/nothing.png');
  } else if (id === 1) {
    image = require('../../assets/images/emojis/excelent.png');
  } else if (id === 2) {
    image = require('../../assets/images/emojis/regular.png');
  } else if (id === 3) {
    image = require('../../assets/images/emojis/bad.png');
  }

  return <>{image && <Image source={image} style={style} />}</>;
}

RatingImg.defaultProps = {
  style: { width: 50, height: 50 },
  id: 0,
};

export default RatingImg;

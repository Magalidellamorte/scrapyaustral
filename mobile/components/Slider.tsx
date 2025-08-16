import RangeSlider from 'rn-range-slider';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const THUMB_RADIUS = 12;

const styles = StyleSheet.create({
  thumb: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderWidth: 2,
    borderColor: '#7f7f7f',
    backgroundColor: '#ffffff',
  },
  rail: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7f7f7f',
  },
  railSelected: {
    height: 4,
    backgroundColor: '#4499ff',
    borderRadius: 2,
  },
});

const Thumb = () => <View style={styles.thumb} />;

const Rail = () => <View style={styles.rail} />;

const RailSelected = () => <View style={styles.railSelected} />;

const Slider = ({ min, max, step, value, setValue }) => {
  const renderThumb = React.useCallback(() => <Thumb />, []);
  const renderRail = React.useCallback(() => <Rail />, []);
  const renderRailSelected = React.useCallback(() => <RailSelected />, []);

  return (
    <RangeSlider
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      step={step}
      min={min}
      max={max}
      low={value}
      disableRange
      onValueChanged={(low) => { setValue(low) }}
    />
  );
};

Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
};

export default Slider;

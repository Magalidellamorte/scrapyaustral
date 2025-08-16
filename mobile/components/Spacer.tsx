import * as React from 'react';
import { View } from 'react-native';

type SpacerProps = {
  size?: number;
  orientation?: 'horizontal' | 'vertical';
};

function Spacer({ size, orientation }: SpacerProps) {
  return (
    <View
      style={{ [orientation === 'horizontal' ? 'height' : 'width']: size }}
    />
  );
}

Spacer.defaultProps = {
  size: 10,
  orientation: 'horizontal',
};

export default Spacer;

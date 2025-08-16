import * as React from 'react';
import { Text, TextProps } from 'react-native';

export default function BoldText(props: TextProps) {
  const { style, ...rest } = props;
  return <Text {...rest} style={[style, { fontWeight: "900" }]} />;
}

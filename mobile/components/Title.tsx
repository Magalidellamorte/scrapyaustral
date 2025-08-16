import React, { ReactNode } from 'react';
import {
  Text,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
} from 'react-native';
import cn from 'react-native-classnames';

type TitleProps = {
  children: ReactNode;
  style?: any;
};

const styles = StyleSheet.create({
  title: {
    color:'#444',
    fontSize: 20,
    fontFamily:'Montserrat-ExtraBold',
    marginBottom:20
  },
});

function Title({
  children,
  style,
}: TitleProps) {

return (
      <Text
        style={[
          cn(styles, 'text','title'),
          style,
        ]}
      >
        {children}
      </Text>
  );
}

Title.defaultProps = {
  type: null,
  disabled: false,
  style: {},
  styleButton: {},
  size: 'normal',
};

export default Title;

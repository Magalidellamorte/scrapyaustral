import React, { ReactNode } from 'react';
import {
  GestureResponderEvent,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import cn from 'react-native-classnames';

type ButtonType =
  | 'primary'
  | 'secondary'
  | 'normal'
  | 'danger'
  | 'dangerLight'
  | 'border'
  | 'radiusBeScrapper'
  | 'borderRadius'
  | 'block'
  | 'borderSmall';

type ButtonProps = {
  type?: ButtonType;
  children: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: any;
  styleButton?: any;
  size?: string;
  icon?: ReactNode;
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    borderBottomStartRadius: 6,
    borderBottomEndRadius: 6,
    borderTopStartRadius: 6,
    borderTopEndRadius: 6,
    paddingTop: Platform.OS === 'android' ? 13 : 13,
    paddingBottom: Platform.OS === 'android' ? 13 : 15,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
    // width: Layout.window.width - Layout.baseMargin,
  },
  primary: {
    backgroundColor: '#dbfff0',
  },
  primaryText: {
    color: '#047e4b',
  },
  border: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#047e4b',
  },
  borderText: {
    color: '#047e4b',
  },
  secondary: {
    backgroundColor: '#49DA8B',
  },
  secondaryText: {
    color: 'white',
  },
  danger: {
    backgroundColor: '#eb4034',
  },
  dangerText: {
    color: 'white',
  },
  dangerLight: {
    backgroundColor: '#ffbebe',
  },
  dangerLightText: {
    color: '#eb4034',
  },

  normal: {
    backgroundColor: 'white',
  },
  normalText: {
    textTransform: 'uppercase',
    fontWeight: '900',
    color: '#49da8b',
  },

  grey: {
    backgroundColor: '#E6E7E4',
  },
  greyText: {
    color: '#444',
  },
  disabled: {
    backgroundColor: '#e6e6e6',
  },
  disabledText: {
    color: '#858585',
  },
  small: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },

  borderRadius: {
    borderBottomStartRadius: 100,
    borderBottomEndRadius: 100,
    borderTopStartRadius: 100,
    paddingHorizontal: 40,
    borderTopEndRadius: 100,
    backgroundColor: '#49DA8B',
  },
  radiusScrapperText: {
    fontSize: 11,
  },
  radiusScrapper: {
    borderBottomStartRadius: 100,
    borderBottomEndRadius: 100,
    borderTopStartRadius: 100,
    borderTopEndRadius: 100,
    paddingHorizontal: 0,
    paddingTop: 8,
    paddingBottom: 8,
  },
  borderRadiusText: {
    color: 'white',
  },

  block: {
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    borderTopStartRadius: 0,
    paddingHorizontal: 20,
    borderTopEndRadius: 0,
    backgroundColor: '#49DA8B',
  },
  blockText: {
    color: 'white',
  },
  borderSmall: {
    borderWidth: 1,
    borderColor: '#39ce67',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    height: 40,
    padding: 0,
  },
  borderSmallText: {
    color: '#a1a1a1',
    fontSize: 12,
    paddingStart: 5,
    paddingTop: 0,
    height: 40,
    zIndex: 1000,
    textAlign: 'left',
  },
});

function Button({
  type,
  disabled,
  children,
  onPress,
  style,
  styleButton,
  size,
  icon,
}: ButtonProps) {
  return (
    <Pressable
      style={[
        cn(styles, 'button', {
          primary: type === 'primary',
          grey: type === 'grey',
          secondary: type === 'secondary',
          danger: type === 'danger',
          dangerLight: type === 'dangerLight',
          radiusScrapper: type === 'radiusBeScrapper',
          normal: type === 'normal',
          border: type === 'border',
          borderSmall: type === 'borderSmall',
          block: type === 'block',
          borderRadius: type === 'borderRadius',
          disabled,
          small: size === 'small',
        }),
        styleButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <Image
          source={icon}
          style={{
            width: 115,
            height: 55,
            overflow: 'hidden',
            objectFit: 'fill',
            position: 'absolute',
            top: -2,
            left: -10,
          }}
        />
      )}
      <Text
        style={[
          cn(styles, 'text', {
            primaryText: type === 'primary',
            greyText: type === 'grey',
            secondaryText: type === 'secondary',
            dangerText: type === 'danger',
            dangerLightText: type === 'dangerLight',
            radiusScrapperText: type === 'radiusBeScrapper',
            blockText: type === 'block',
            borderText: type === 'border',
            borderRadiusText: type === 'borderRadius',
            borderSmallText: type === 'borderSmall',
            disabledText: disabled,
          }),
          style,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

Button.defaultProps = {
  type: null,
  disabled: false,
  style: {},
  styleButton: {},
  size: 'normal',
};

export default Button;

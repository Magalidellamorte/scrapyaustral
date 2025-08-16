import * as React from 'react';
import {
  TextInput as TextInputNative,
  TextInputProps,
  View,
  StyleSheet,
  Text,
} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  name: string;
  placeholder: string;
  forceLabel?: boolean;
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  action: {
    position: 'absolute',
    top: 13,
    right: 4,
  },
});

const TextInputNoFormik = ({
  name,
  label,
  placeholder,
  forceLabel,
  action,
  value,
  onChange,
  ...rest
}: CustomTextInputProps) => (
  <View>
    {label || forceLabel ? <Text>{label ?? ''}</Text> : null}

    <TextInputNative
      style={styles.input}
      onChangeText={onChange}
      value={value}
      placeholder={placeholder ?? ''}
      {...rest}
    />

    {action ? <View style={styles.action}>{action}</View> : null}
  </View>
);

TextInputNoFormik.defaultProps = {
  forceLabel: false,
};

export default TextInputNoFormik;

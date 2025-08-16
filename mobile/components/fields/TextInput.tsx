import * as React from 'react';
import {
  TextInput as TextInputNative,
  TextInputProps,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { useFormikContext } from 'formik';
import get from 'lodash/get';

import ErrorMessage from '../ErrorMessage';

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

const TextInput = ({
  name,
  label,
  placeholderLine,
  placeholder,
  forceLabel,
  action,
  ...rest
}: CustomTextInputProps) => {
  const { handleChange, handleBlur, values, errors, touched } =
    useFormikContext();

  return (
    <View>
      {label || forceLabel ? <Text>{label ?? ''}</Text> : null}

      <TextInputNative
        style={styles.input}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={get(values, name)}
        placeholder={placeholder ?? ''}
        {...rest}
      />

      {action ? <View style={styles.action}>{action}</View> : null}

      <ErrorMessage message={get(touched, name) && get(errors, name)} />
    </View>
  );
};

TextInput.defaultProps = {
  forceLabel: false,
};

export default TextInput;

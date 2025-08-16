import * as React from 'react';
import {
  TextInput as TextInputNative,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { useFormikContext } from 'formik';
import get from 'lodash/get';

import ErrorMessage from '../ErrorMessage';

interface CustomTextInputProps {
  action?: string;
  label: string;
  name: string;
  placeholder: string;
  placeholderLine: string;
  forceLabel?: boolean;
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingHorizontal: 15,
  },
  action: {
    position: 'absolute',
    top: 13,
    right: 4,
  },
  line: {
    borderWidth: 1,
    borderColor: '#39ce67',
    paddingTop: 10,
    paddingBottom: 0,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 10,
    position: 'relative',
  },
  lineText: {
    position: 'absolute',
    top: -10,
    left: 5,
    paddingHorizontal: 6,
    fontSize: 12,
    backgroundColor: 'white',
  },
  lineTextError: {
    borderColor: 'red',
  },
});

const TextInputLine = ({
  name,
  label,
  placeholder,
  placeholderLine,
  forceLabel,
  action,
  ...rest
}: CustomTextInputProps) => {
  const { handleChange, handleBlur, values, errors, touched } =
    useFormikContext();

  return (
    <View
      style={[
        styles.line,
        get(touched, name) && get(errors, name) ? styles.lineTextError : null,
      ]}
    >
      {label || forceLabel ? (
        <Text style={[styles.lineText]}>{label ?? ''}</Text>
      ) : null}
      {placeholderLine ? <Text>{placeholderLine ?? ''}</Text> : null}

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

TextInputLine.defaultProps = {
  forceLabel: false,
  action: '',
};

export default TextInputLine;

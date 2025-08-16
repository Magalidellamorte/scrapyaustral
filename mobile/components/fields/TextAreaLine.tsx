import * as React from 'react';
import {
  TextInput as TextInputNative,
  TextInputProps,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { useFormikContext } from 'formik';

import ErrorMessage from '../ErrorMessage';

interface CustomTextAreaProps extends TextInputProps {
  name: string;
  placeholder: string;
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 15,
    textAlignVertical: 'top',
    paddingVertical: 10,
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
    left: 10,
    paddingHorizontal: 6,
    backgroundColor: 'white',
  },
  lineTextError: {
    borderColor: 'red',
  },
});

const TextAreaLine = ({
  name,
  label,
  placeholder,
  ...rest
}: CustomTextAreaProps) => {
  const { handleChange, handleBlur, values, errors, touched } =
    useFormikContext();
  return (
    <View style={[styles.line, (touched[name] && errors[name] ? styles.lineTextError : null) ]}>
      {label ? <Text style={[styles.lineText]} >{label}</Text> : null}
      <TextInputNative
        style={styles.input}
        multiline
        numberOfLines={5}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={values[name]}
        placeholder={placeholder ?? ''}
        {...rest}
      />

      <ErrorMessage message={touched[name] && errors[name]} />
    </View>
  );
};

export default TextAreaLine;

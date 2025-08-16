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
    borderRadius: 10,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginVertical: 10,
    textAlignVertical: 'top',
    paddingVertical: 15,
  },
});

const TextArea = ({
  name,
  label,
  placeholder,
  ...rest
}: CustomTextAreaProps) => {
  const { handleChange, handleBlur, values, errors, touched } =
    useFormikContext();
  return (
    <View>
      {label ? <Text>{label}</Text> : null}
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

export default TextArea;

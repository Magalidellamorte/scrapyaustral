import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useFormikContext } from 'formik';
import get from 'lodash/get';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

import ErrorMessage from '../ErrorMessage';

type SelectOption = {
  label: string;
  value: string | number;
};

interface CustomSelectProps {
  name: string;
  placeholder: string;
  label?: string;
  options: SelectOption[];
  forceLabel?: boolean;
  multiple?: boolean;
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    borderColor: '#a1a1a1',
    paddingRight: 30, // to ensure the text is never behind the icon
    color: '#a1a1a1',
  },
  inputAndroid: {
    paddingHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    borderColor: '#a1a1a1',
    paddingRight: 30, // to ensure the text is never behind the icon
    color: '#a1a1a1',
  },
});

const Select = ({
  name,
  label,
  placeholder,
  options,
  forceLabel,
  multiple,
  ...rest
}: CustomSelectProps) => {
  const { handleBlur, values, errors, touched, setFieldValue } =
    useFormikContext();

  return (
    <View>
      {label || forceLabel ? <Text>{label ?? ''}</Text> : null}

      <RNPickerSelect
        placeholder={{
          label: placeholder ?? '',
          value: null,
          color: '#d1d1d1',
        }}
        items={options}
        onValueChange={(value) => {
          setFieldValue(name, value);
        }}
        onBlur={handleBlur(name)}
        value={get(values, name) ?? null}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 22,
            right: 12,
          },
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => <FontAwesome size={16} name="arrow-down" color="#d1d1d1" />}
        disabled={!options.length}
        multiple
      />

      <ErrorMessage message={get(touched, name) && get(errors, name)} />
    </View>
  );
};

Select.defaultProps = {
  label: '',
  forceLabel: false,
  multiple: false,
};

export default Select;

import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface CustomSelectProps {
  placeholder: string;
  label?: string;
  forceLabel?: boolean;
  onChange: () => void;
}

const styles = StyleSheet.create({
  buttonOpen: {
    borderRadius: 10,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 15,
    marginVertical: 10,
    justifyContent: 'center',
  },
  textStyle: {
    color: '#858585',
  },
});

const TimePicker = ({
  label,
  placeholder,
  forceLabel,
  onChange,
}: CustomSelectProps) => {
  const [showWithDatepicker, setShowWithDatepicker] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleConfirm = (date) => {
    const newValue = `${`0${date.getHours()}`.slice(
      -2
    )}:${`0${date.getMinutes()}`.slice(-2)}`;

    setValue(newValue);

    onChange(newValue);

    setShowWithDatepicker(false);
  };

  return (
    <View>
      {label || forceLabel ? <Text>{label ?? ''}</Text> : null}

      {/* <DateTimePickerModal
        isVisible={showWithDatepicker}
        mode="time"
        locale="en_GB"
        is24Hour
        onConfirm={handleConfirm}
        onCancel={() => setShowWithDatepicker(false)}
        date={new Date()}
      /> */}

      <Pressable
        style={styles.buttonOpen}
        onPress={() => setShowWithDatepicker(true)}
      >
        <Text style={styles.textStyle}>{value || placeholder}</Text>
      </Pressable>
    </View>
  );
};

TimePicker.defaultProps = {
  label: '',
  forceLabel: false,
};

export default TimePicker;

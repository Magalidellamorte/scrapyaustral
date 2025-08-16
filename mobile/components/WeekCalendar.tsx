import { useFormikContext } from 'formik';
import * as React from 'react';
import { View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import get from 'lodash/get';

import ErrorMessage from './ErrorMessage';
import TimePicker from './TimePicker';

type WeekCalendarProps = {
  name: string;
  value?: string;
  disabled?: boolean;
};

function WeekCalendar({ name, value, disabled }: WeekCalendarProps) {
  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];

  const { values, errors, touched, setFieldTouched, setFieldValue } =
    useFormikContext();

  const selectedItems = get(values, name, []);
  const handlePressed = React.useCallback(
    (dayNumber: number) => (selected: number) => {
      setFieldTouched(name, true);

      if (selected) {
        setFieldValue(name, [
          ...selectedItems,
          {
            dayNumber,
            from: '',
            to: '',
          },
        ]);
      } else {
        setFieldValue(
          name,
          selectedItems.filter((item) => item.dayNumber !== dayNumber)
        );
      }
    },
    [selectedItems, name]
  );

  const handleTimeChange =
    (key: string, dayNumber: number) => (time: string) => {
      const newSelectedItems = selectedItems.map((item) => {
        if (item.dayNumber === dayNumber) {
          return {
            ...item,
            [key]: time,
          };
        }

        return item;
      });

      setFieldValue(name, newSelectedItems);
    };

  return (
    <>
      <ErrorMessage message={get(touched, name) && get(errors, name)} />

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {days.map((day, index) => (
          <View
            key={day}
            style={{
              paddingVertical: 5,
            }}
          >
            <BouncyCheckbox
              disableBuiltInState={disabled}
              size={25}
              fillColor="#49DA8B"
              unfillColor="#FFFFFF"
              text={day}
              iconStyle={{ borderColor: '#49DA8B' }}
              onPress={handlePressed(index)}
              textStyle={{
                textDecorationLine: 'none',
              }}
            />
            {selectedItems.map((item) => item.dayNumber).includes(index) ? (
              <>
                <TimePicker
                  placeholder="Desde"
                  placeholderTextColor="#ccc"
                  onChange={handleTimeChange('from', index)}
                />
                <TimePicker
                  placeholder="Hasta"
                  placeholderTextColor="#ccc"
                  onChange={handleTimeChange('to', index)}
                />
              </>
            ) : null}
          </View>
        ))}
      </View>
    </>
  );
}

WeekCalendar.defaultProps = {
  disabled: false,
};

export default WeekCalendar;

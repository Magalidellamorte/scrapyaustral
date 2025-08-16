import * as React from 'react';
import { View, StyleSheet, Text, Modal, Pressable } from 'react-native';
import { useFormikContext } from 'formik';
import get from 'lodash/get';
import { FontAwesome } from '@expo/vector-icons';

import ErrorMessage from '../ErrorMessage';
import Layout from '../../constants/Layout';
import Button from '../Button';
import CategoryItem from '../CategoryItem';

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
  arrowDown: {
    position: 'absolute',
    right: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: Layout.window.width - Layout.baseMargin,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

const SelectMultiple = ({
  name,
  label,
  placeholder,
  options,
  forceLabel,
  multiple,
  ...rest
}: CustomSelectProps) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const { values, errors, touched, setFieldTouched, setFieldValue } =
    useFormikContext();

  const selectedItems = get(values, name, []);

  const handleChange = () => {
    setModalVisible(!modalVisible);
  };

  const handlePressed = React.useCallback(
    (value, selected) => {
      setFieldTouched(name, true);

      if (selected) {
        setFieldValue(
          name,
          selectedItems.filter((item) => item !== value)
        );
      } else {
        setFieldValue(name, [...selectedItems, value]);
      }
    },
    [selectedItems, name]
  );

  return (
    <View>
      {label || forceLabel ? <Text>{label ?? ''}</Text> : null}

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={handleChange}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {(options ?? []).map(({ label: optionLabel, value }) => (
                <CategoryItem
                  size={60}
                  key={`${value}-${selectedItems.includes(value)}`}
                  value={value}
                  onPress={handlePressed}
                  selected={selectedItems.includes(value)}
                  label={optionLabel}
                />
              ))}
            </View>

            <Button type="primary" onPress={handleChange}>
              Seleccionar
            </Button>
          </View>
        </View>
      </Modal>

      <Pressable
        style={styles.buttonOpen}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>
          {selectedItems.length > 0
            ? options
                .filter((item) => selectedItems.includes(item.value))
                .map((item) => item.label)
                .join(', ')
            : placeholder}
        </Text>
        <FontAwesome
          style={styles.arrowDown}
          size={16}
          name="arrow-down"
          color="#d1d1d1"
        />
      </Pressable>

      <ErrorMessage message={get(touched, name) && get(errors, name)} />
    </View>
  );
};

SelectMultiple.defaultProps = {
  label: '',
  forceLabel: false,
  multiple: false,
};

export default SelectMultiple;

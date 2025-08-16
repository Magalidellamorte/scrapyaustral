import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import get from 'lodash/get';
import * as React from 'react';
import {
  Button,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  disabled?: boolean;
}

const styles = StyleSheet.create({
  // ... tus estilos existentes ...
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  pickerContainer: {
    backgroundColor: 'white', // Fondo blanco para el contenedor del Picker
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 20,
    marginVertical: 150,
  },
  line: {
    borderWidth: 1,
    borderColor: '#39ce67',
    paddingTop: Platform.OS === 'android' ? 0 : 10,
    paddingBottom: 0,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 10,
    position: 'relative',
  },
  lineText: {
    position: 'absolute',
    top: -10,
    left: 8,
    paddingHorizontal: 6,
    fontSize: 12,
    backgroundColor: 'white',
  },
  dropdown: {
    paddingHorizontal: 15,
    height: 40,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 12,
    color: '#a1a1a1',
  },
  lineTextError: {
    borderColor: 'red',
  },
});

const SelectLine = ({
  name,
  label,
  placeholder,
  options,
  disabled = false,
}: CustomSelectProps) => {
  const { handleBlur, values, errors, touched, setFieldValue } =
    useFormikContext();
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <View
      style={[
        styles.line,
        get(touched, name) && get(errors, name) ? styles.lineTextError : null,
        !label ? { paddingTop: 0, paddingBottom: 0 } : null,
        disabled ? { opacity: 0.5 } : null,
      ]}
    >
      {label ? <Text style={[styles.lineText]}>{label ?? ''}</Text> : null}
      {Platform.OS === 'android' ? (
        <>
          <Picker
            style={{
              height: 50,
              marginLeft: -8,
              width: '110%',
              padding: 0,
            }}
            selectedValue={get(values, name)}
            onValueChange={(itemValue) => {
              setFieldValue(name, itemValue);
            }}
            onBlur={() => handleBlur(name)}
            enabled={!disabled}
          >
            <Picker.Item label={placeholder ?? 'Select...'} value="" />
            {options.map((option, index) => (
              <Picker.Item
                key={index}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </>
      ) : (
        <TouchableOpacity
          style={[
            styles.dropdown,
            get(touched, name) && get(errors, name)
              ? styles.lineTextError
              : null,
          ]}
          onPress={() => !disabled && setModalVisible(true)}
          disabled={disabled}
        >
          {(() => {
            const selectedOption = options.find(
              (option) => option.value == get(values, name)
            );

            return (
              <Text style={styles.dropdownText}>
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
            );
          })()}
        </TouchableOpacity>
      )}

      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.pickerContainer}>
              <Text
                style={{ fontWeight: 'bold', fontSize: 20, margin: 0, padding: 0 }}
              >
                {label}
              </Text>
              <Picker
                selectedValue={get(values, name)}
                onValueChange={(itemValue) => {
                  setFieldValue(name, itemValue);
                }}
                onBlur={() => handleBlur(name)}
                enabled={!disabled}
              >
                <Picker.Item label={placeholder ?? 'Select...'} value="" />
                {options.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
              <Button title="Seleccionar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}

      <ErrorMessage message={get(touched, name) && get(errors, name)} />
    </View>
  );
};

export default SelectLine;

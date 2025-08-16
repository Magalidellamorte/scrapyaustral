import React from 'react';
import { Text, View, Dimensions, StyleSheet, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateRangePicker from 'rn-select-date-range';
import moment from 'moment';
import TextInput from './TextInput';
import Layout from '../../constants/Layout';
import Button from '../Button';
import Spacer from '../Spacer';

type InputOfferProps = {
  name: string;
  offer: any;
  onSet: any;
  value?: number;
  disabled?: boolean;
  onGet: any;
  color: string;
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    lineHeight: 30,
  },
  selectedDateContainerStyle: {
    height: 35,
    width: '100%',
    backgroundColor: '#49DA8B',
  },
  selectedDateStyle: {
    fontWeight: '900',
    color: 'white',
  },
  centeredView: {
    flex: 0,
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
  dayText: {
    fontSize: 16,
    paddingVertical: 5,
  },
});

function InputOffer({
  name,
  offer,
  value,
  color,
  onSet,
  onGet,
  disabled,
}: InputOfferProps) {
  let modal: any;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRange, setRange] = React.useState(onGet);
  const handleDateChange = (range: any) => {
    if (onSet) {
      onSet(range);
    }

    setRange(range);
  };

  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];
  if (name === 'value_with_shipping') {
    modal = (
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {offer?.user?.availabilities?.map((availability: any) => (
              <Text key={availability.day_index} style={styles.dayText}>
                {days[availability.day_index]} de
                {availability.from} a {availability.to}
              </Text>
            ))}
            <Spacer size={20} />

            <Button type="primary" onPress={() => setModalVisible(false)}>
              Cerrar
            </Button>
          </View>
        </View>
      </Modal>
    );
  } else if (name === 'value_without_shipping') {
    modal = (
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DateRangePicker
              onSelectDateRange={handleDateChange}
              blockSingleDateSelection
              responseFormat="YYYY-MM-DD"
              maxDate={moment().add(2, 'month')}
              minDate={moment()}
              selectedDateContainerStyle={styles.selectedDateContainerStyle}
              selectedDateStyle={styles.selectedDateStyle}
            />
            <Button type="primary" onPress={() => setModalVisible(false)}>
              Cerrar
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
  return (
    <>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: Dimensions.get('window').width / 1.6,
          }}
        >
          <View
            style={{
              flex: 0.5,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              borderRightWidth: 0,
              borderEndWidth: 0,
              borderWidth: 1,
              borderColor: '#49DA8B',
              height: 50,
            }}
          >
            <Text>$</Text>
          </View>
          <View
            style={{
              flex: 1.4,
            }}
          >
            <TextInput
              keyboardType="numeric"
              name={name}
              placeholderTextColor="#ccc"
              placeholder={value ? value.toString() : '0'}
              editable={!disabled}
              style={{
                alignItems: 'center',
                height: 50,
                paddingHorizontal: 10,
                borderRightWidth: 0,
                borderLeftWidth: 0,
                borderStartWidth: 0,
                borderWidth: 1,
                borderColor: '#49DA8B',
              }}
            />
          </View>
          <View
            style={{
              flex: 1.5,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#eee',
              borderStartWidth: 0,
              borderWidth: 1,
              borderColor: '#49DA8B',
              height: 50,
            }}
          >
            <Text>x {offer?.measure_type?.name}</Text>
          </View>
        </View>
      </View>
      {selectedRange && selectedRange.firstDate ? (
        <Text style={{ textAlign: 'center', marginTop: 5 }}>
          Entre {moment(selectedRange.firstDate).format('DD/MM/YYYY')} y{' '}
          {moment(selectedRange.secondDate).format('DD/MM/YYYY')}
        </Text>
      ) : null}
      {modal}
    </>
  );
}

InputOffer.defaultProps = {};
export default InputOffer;

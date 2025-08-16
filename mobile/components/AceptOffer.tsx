import React from 'react';
import { Modal, Text, View, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import Layout from '../constants/Layout';
import Button from './Button';
import Spacer from './Spacer';
import SetRating from './rating/SetRating';
import useConfirmPostulation from '../services/useConfirmPostulation';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: Layout.window.width - Layout.baseMargin,
    margin: 20,
    borderRadius: 20,
    padding: 35,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionContainer: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  optionText: {
    color: '#333',
  },
  activeOption: {
    borderColor: '#49DA8B',
    backgroundColor: '#dbfff0',
  },
  activeOptionText: {
    color: '#047e4b',
  },
});

const AceptOffer = ({ offerId, postulations }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [reason, setReason] = React.useState('');
  const confirmPostulation = useConfirmPostulation();

  const buttonsHandler = (reason, rating, postulationId) => {
    confirmPostulation.mutate(
      { postulationId, reason, rating },
      {
        onSuccess: (response) => {
          Toast.show({
            type: 'success',
            text1: 'La venta se ha concretado correctamente',
            position: 'bottom',
            visibilityTime: 500,
          });
          setShowModal(false);
          setTimeout(() => {
            navigation.navigate({
              name: 'ViewOwnOffer',
              key: `force-navigation-${Date.now()}`,
              params: { id: offerId },
            });
          }, 1500);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  const { user } = postulations[0];
  return (
    <>
      <Button type="secondary" onPress={() => setShowModal(!showModal)}>
        Concretar operación
      </Button>
      <Modal
        animationType="fade"
        transparent
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                textAlign: 'right',
                color: '#ccc',
                marginBottom: 10,
              }}
              onPress={() => setShowModal(!showModal)}
            >
              <FontAwesome name="close" />
            </Text>
            <Text style={styles.title}>
              ¡Estas a un paso! Calificá tu experiencia con {user.full_name} y
              concretá la operación
            </Text>

            <Spacer size={25} />

            <View style={{ alignContent: 'center', alignItems: 'center' }}>
              <SetRating onFinishRating={setRating} />
              <TextInput
                multiline
                numberOfLines={5}
                onChangeText={(value) => setReason(value)}
                placeholder="Dejanos un mensaje contando tu experiencia"
                placeholderTextColor="#ccc"
              />
            </View>
            <Spacer size={15} />

            <Button
              type="primary"
              onPress={() => buttonsHandler(reason, rating, postulations[0].id)}
            >
              Concretar
            </Button>
            <Spacer size={15} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AceptOffer;

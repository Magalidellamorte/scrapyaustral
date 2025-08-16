import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Layout from '../constants/Layout';
import useDeletePostulation from '../services/useDeletePostulation';
import Button from './Button';
import Spacer from './Spacer';

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

const DeleteOffer = ({ offerId, postulations }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = React.useState(false);
  const confirmPostulation = useDeletePostulation();

  const buttonsHandler = (postulationId, to) => {
    confirmPostulation.mutate(
      { postulationId },
      {
        onSuccess: (response) => {
          Toast.show({
            type: 'success',
            text1: 'La oferta se ha eliminó correctamente',
            position: 'bottom',
            visibilityTime: 500,
          });
          setShowModal(false);
          setTimeout(() => {
            if (to === 'ViewOwnOffer')
              navigation.navigate({
                name: to,
                key: `force-navigation-${Date.now()}`, // Add a unique key to force navigation
                params: { id: offerId },
              });
            else
              navigation.navigate({
                name: to,
                params: { text: '___' },
              });
          }, 1500);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <>
      <Button type="dangerLight" onPress={() => setShowModal(!showModal)}>
        Eliminar ofertante
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
              ¿Estas seguro que deseas eliminar al ofertante?
            </Text>
            <Text
              style={[
                styles.title,
                { fontStyle: 'italic', fontWeight: 'normal', color: '#333' },
              ]}
            >
              Al eliminar al ofertante el mismo ya no podrá volver a ofertar.
            </Text>

            <Spacer size={25} />

            <Button
              type="dangerLight"
              onPress={() => buttonsHandler(postulations[0].id, 'ViewOwnOffer')}
            >
              Eliminar
            </Button>
            <Spacer size={25} />
            <Button
              type="dangerLight"
              onPress={() => buttonsHandler(postulations[0].id, 'Support')}
            >
              Eliminar y denunciar
            </Button>
            <Spacer size={15} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DeleteOffer;

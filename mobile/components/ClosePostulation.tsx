import React from 'react';
import { Modal, Text, View, StyleSheet, Pressable } from 'react-native';
import get from 'lodash/get';
import cn from 'react-native-classnames';
import { useQueryClient } from 'react-query';
import Toast from 'react-native-toast-message';

import { useNavigation } from '@react-navigation/native';
import Layout from '../constants/Layout';
import Button from './Button';
import Spacer from './Spacer';
import useCloseePostulationReasons from '../services/useClosePostulationReasons';
import useClosePostulation from '../services/useClosePostulation';

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

const ClosePostulation = ({ postulationId, offerId, onCloseFinish }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = React.useState(false);
  const [closeReason, setCloseReason] = React.useState();
  const queryClient = useQueryClient();

  const closedReasonsQuery = useCloseePostulationReasons();
  const closedReasonsOptions = get(closedReasonsQuery, 'data.data', []);

  const closePostulation = useClosePostulation();

  const handleModalClose = async () => {
    if (!closeReason) return;

    if (onCloseFinish) {
      onCloseFinish();
    }

    await closePostulation.mutate(
      { postulationId, reasonId: closeReason },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['postulation', postulationId]);
          queryClient.invalidateQueries(['offer', offerId]);

          Toast.show({
            type: 'success',
            text1: '¡Has cancelado la postulación!',
            position: 'bottom',
            visibilityTime: 500,
          });

          setShowModal(!showModal);
          navigation.navigate('Chat');
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1:
              error?.response?.data?.message ??
              'Error al cancelar la postulación',
            position: 'bottom',
            visibilityTime: 1000,
          });
          setShowModal(!showModal);
        },
      }
    );
  };

  const translations = {};

  translations.regret = 'Ya no me interesa el material';
  translations.with_other_scraper = 'El cliente entrego a otra persona';
  translations.unable_to_agree = 'No me puse de acuerdo con el cliente';
  translations.other = 'Otra razón';

  return (
    <>
      <Button type="dangerLight" onPress={() => setShowModal(!showModal)}>
        Cancelar postulación
      </Button>

      <Modal
        animationType="fade"
        transparent
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>
              ¿Por qué decidiste cancelar la postulación?
            </Text>

            <Spacer size={5} />

            <Text style={styles.subtitle}>
              Esta informacion nos ayuda a mejorar
            </Text>

            <Spacer size={15} />

            {closedReasonsOptions.map(({ id, name }) =>
              Object.keys(translations).includes(name) ? (
                <Pressable key={id} onPress={() => setCloseReason(id)}>
                  <View
                    style={cn(styles, 'optionContainer', {
                      activeOption: id === closeReason,
                    })}
                  >
                    <Text
                      style={cn(styles, 'optionText', {
                        activeOptionText: id === closeReason,
                      })}
                    >
                      {translations[name]}
                    </Text>
                  </View>
                </Pressable>
              ) : null
            )}

            <Spacer size={15} />

            <Button
              type="secondary"
              onPress={handleModalClose}
              disabled={!closeReason || closePostulation.isLoading}
            >
              {closePostulation.isLoading ? 'Cancelando' : 'Cancelar'}
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ClosePostulation;

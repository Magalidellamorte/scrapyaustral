import React from 'react';
import { Modal, Text, View, StyleSheet, Pressable } from 'react-native';
import get from 'lodash/get';
import cn from 'react-native-classnames';
import { useQueryClient } from 'react-query';
import Toast from 'react-native-toast-message';

import Layout from '../constants/Layout';
import Button from './Button';
import Spacer from './Spacer';
import useClosedReasons from '../services/useClosedReasons';
import useCloseOffer from '../services/useCloseOffer';

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

const mappingType = {
  Donar: 'Donación',
  Vender: 'Venta',
};

const CloseOffer = ({ type, offerId, postulations, user, onCloseFinish }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [closeReason, setCloseReason] = React.useState();
  const queryClient = useQueryClient();

  const closedReasonsQuery = useClosedReasons();
  const closedReasonsOptions = get(closedReasonsQuery, 'data.data', []);

  const closeOffer = useCloseOffer();

  const handleModalClose = async () => {
    if (!closeReason) return;

    if (onCloseFinish) {
      onCloseFinish();
    }

    await closeOffer.mutate(
      { offerId, reasonId: closeReason },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['offer', offerId]);

          Toast.show({
            type: 'success',
            text1: '¡Has cerrado el anuncio correctamente!',
            position: 'bottom',
            visibilityTime: 500,
          });

          setShowModal(!showModal);
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1:
              error?.response?.data?.message ?? 'Error al cerrar el anuncio',
            position: 'bottom',
            visibilityTime: 1000,
          });
        },
      }
    );
  };

  const translations = {};

  if (user) {
    if (
      postulations.filter(
        (p) => p.offer_status_id === 2 || p.offer_status_id === 3
      ).length
    ) {
      const postulation = postulations.filter((p) => p.user_id === user.id)[0];

      //
      translations.with_selected_scraper = `Ya he concretado la operación con ${postulation?.user?.full_name}`;
    }
  }
  // translations.with_other_scraper = 'Entregue el material a un scraper';
  translations.outside_scrapy = 'Entregue el material fuera de Scrapy';
  translations.regret = 'Decidi no entregar el material';
  translations.other = 'Otra razón';

  return (
    <>
      {user ? (
        <Button type="primary" onPress={() => setShowModal(!showModal)}>
          Cerrar {type ? (mappingType[type] ?? '').toLowerCase() : 'solicitud'}
        </Button>
      ) : (
        <Button type="dangerLight" onPress={() => setShowModal(!showModal)}>
          Eliminar{' '}
          {type ? (mappingType[type] ?? '').toLowerCase() : 'esta solicitud'}
        </Button>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>
              ¿Por qué decidiste eliminar la{' '}
              {type ? (mappingType[type] ?? '').toLowerCase() : 'solicitud'}?
            </Text>

            <Spacer size={5} />

            <Text style={styles.subtitle}>
              Esta información nos ayuda a mejorar
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
              disabled={!closeReason || closeOffer.isLoading}
            >
              {closeOffer.isLoading ? 'Cerrando' : 'Cerrar'}
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CloseOffer;

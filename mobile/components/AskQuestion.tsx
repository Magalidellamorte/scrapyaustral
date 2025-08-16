import { Formik } from 'formik';
import React from 'react';
import { Modal, ScrollView, Text, View, StyleSheet } from 'react-native';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import Layout from '../constants/Layout';
import Button from './Button';
import TextArea from './fields/TextArea';
import Spacer from './Spacer';
import useAskQuestionOffer from '../services/useAskQuestionOffer';

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: Layout.window.height,
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
});

const AskQuestion = ({ offerId }) => {
  const [showModal, setShowModal] = React.useState(false);
  const questionCall = useAskQuestionOffer();

  const questionSchema = Yup.object().shape({
    question: Yup.string().required('requerido'),
  });

  const initialValues = {
    question: '',
  };

  const handleModalClose = () => {
    setShowModal(!showModal);
  };

  const submitAskedQuestion = ({ question }) => {
    questionCall.mutate(
      { offerId, question },
      {
        onSuccess: () => {
          handleModalClose();

          Toast.show({
            type: 'success',
            text1: 'Tu consulta se ha enviado',
            position: 'bottom',
            visibilityTime: 500,
          });
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: error?.response?.data?.message ?? 'Error al enviar consulta',
            position: 'bottom',
            visibilityTime: 1000,
          });
        },
      }
    );
  };

  return (
    <>
      <Button type="primary" onPress={handleModalClose}>
        Hacer una pregunta
      </Button>

      <Modal
        animationType="fade"
        transparent
        visible={showModal}
        onRequestClose={handleModalClose}
      >
        <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.title}>Consulta</Text>

              <Spacer />

              <Formik
                initialValues={initialValues}
                onSubmit={submitAskedQuestion}
                validationSchema={questionSchema}
              >
                {({ handleSubmit, isValid }) => (
                  <>
                    <TextArea
                      name="question"
                      placeholderTextColor="#ccc"
                      placeholder="Escribí tu mensaje"
                      numberOfLines={10}
                    />

                    <Spacer />

                    <Button
                      type="primary"
                      onPress={handleSubmit}
                      disabled={!isValid || questionCall.isLoading}
                    >
                      {questionCall.isLoading ? 'Enviando consulta' : 'Enviar'}
                    </Button>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
};

export default AskQuestion;

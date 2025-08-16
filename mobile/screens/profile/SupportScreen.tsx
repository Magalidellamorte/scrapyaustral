import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import * as React from 'react';
import { Linking, StatusBar, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

import IconRight from '../../assets/icons/chevron-right.svg';
import Button from '../../components/Button';
import TextArea from '../../components/fields/TextArea';
import Header from '../../components/Header';
import Spacer from '../../components/Spacer';
import Title from '../../components/Title';
import config from '../../config/config';
import useRequestSupport from '../../services/useRequestSupport';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 130,
    paddingTop: 10,
    marginTop: -150,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
  },
  form: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    padding: 20,
    paddingRight: 10,
    borderRadius: 10,

    textAlignVertical: 'top',
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  bloqueHeader: {
    backgroundColor: '#f9c2ff',
    height: 200,
  },
  buttonPosition: {
    position: 'absolute',
    bottom: 0,
    elevation: 11,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  BloquePost: {
    width: '100%',
    justifyContent: 'center',
  },

  shadowProp: {
    shadowColor: 'black',
    backgroundColor: 'white',
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.5,
  },
  bloqueRespuestas: {
    borderColor: '#49DA8B',
    borderWidth: 1,
    paddingTop: 10,
    borderRadius: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  iosPadding: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  bloqueVerFaq: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
});

export default function SupportScreen({ navigation }) {
  const support = useRequestSupport();

  const supportSchema = Yup.object().shape({
    question: Yup.string().required('requerido'),
  });

  const initialValues = {
    question: '',
  };

  const requestSupport = (values) => {
    support.mutate(values.question, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Tu consulta se ha enviado',
          position: 'bottom',
          visibilityTime: 500,
          onHide: () => {
            navigation.navigate('Profile');
          },
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
    });
  };

  return (
    <>
      <Header rounded={false} />

      <LinearGradient
        colors={['#49DA8B', '#dbfff0', 'white']}
        style={styles.bloqueHeader}
        start={{ x: 0, y: 0.7 }} // Comienza en la parte superior izquierda
        end={{ x: 0, y: 1 }} // Termina en la parte inferior
      >
        <View style={[{ paddingHorizontal: 20 }]}>
          <Title style={{ color: 'white' }}>¡Hola!</Title>
          <Text style={{ color: 'white', marginTop: -10 }}>
            Contanos cómo te podemos ayudar
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Formik
          initialValues={initialValues}
          onSubmit={requestSupport}
          validationSchema={supportSchema}
        >
          {({ handleSubmit }) => (
            <>
              <View style={[styles.BloquePost]}>
                <TextArea
                  style={[styles.form, styles.shadowProp]}
                  name="question"
                  placeholderTextColor="#ccc"
                  placeholder="Escribí tu mensaje"
                  numberOfLines={10}
                />

                <View style={styles.buttonPosition}>
                  <Button
                    type="borderRadius"
                    disabled={support.isLoading}
                    onPress={handleSubmit}
                  >
                    Enviar mensaje
                  </Button>
                </View>
              </View>
            </>
          )}
        </Formik>

        <Spacer size={60} />

        <View style={[styles.bloqueRespuestas, styles.shadowProp]}>
          <Text
            style={{
              fontWeight: '900',
              marginBottom: 20,
              justifyContent: 'flex-start',
            }}
          >
            Encuentra tu respuesta
          </Text>

          <View
            style={[styles.bloqueVerFaq, styles.shadowProp]}
            onPress={() => Linking.openURL(config.FAQ_URL)}
          >
            <Text
              style={{
                paddingLeft: 20,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flex: 1,
              }}
            >
              Ver FAQs
            </Text>
            <Button
              style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
              type="block"
            >
              <IconRight />
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}

import * as React from 'react';
import { StyleSheet, Text, Keyboard, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import { Ionicons } from '@expo/vector-icons';
import Layout from '../constants/Layout';
import Button from '../components/Button';
import TextInput from '../components/fields/TextInput';
import TextInputLine from '../components/fields/TextInputLine';
import useForgotPassword from '../services/useForgotPassword';
import useResetPassword from '../services/useResetPassword';
import Spacer from '../components/Spacer';
import EmailIcon from '../assets/icons/email.svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  input: {
    elevation: -1,
    width: Layout.window.width - Layout.baseMargin,
    fontSize: 16,
    paddingLeft: 58,

    backgroundColor: '#eee',
    borderRadius: 30,
    borderColor: 'rgba(0,0,0,.1)',
    borderWidth: 1,
    height: 50,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  buttons: {
    width: Layout.window.width - 40,
    height: 200,
    justifyContent: 'space-between',
  },
});

export default function ForgotPasswordScreen({ navigation }) {
  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [asked, setAsked] = React.useState(false);

  const AskSchema = Yup.object().shape({
    email: Yup.string()
      .email('Correo electrónico inválido')
      .required('requerido'),
  });

  const ResetSchema = Yup.object().shape({
    email: Yup.string()
      .email('Correo electrónico inválido')
      .required('requerido'),
    password: Yup.string()
      .min(5, 'Al menos 5 caracteres')
      .required('requerido'),
    token: Yup.string().required('requerido'),
  });

  const renderBackButton =
    navigation.getState().type !== 'tab' && navigation.canGoBack() ? (
      <View
        style={{
          position: 'absolute',
          top: 55,
          borderColor: 'red',
          left: 10,
          width: 40,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={28}
          color="#047e4b"
          onPress={() => navigation.goBack()}
        />
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      {renderBackButton}

      <Text
        style={{
          textAlign: 'center',
          position: 'absolute',
          top: 50,
          fontSize: 25,
          fontWeight: "900",
          color: '#434343',
          marginBottom: 15,
        }}
      >
        Recuperar contraseña
      </Text>
      <View style={isKeyboardVisible && { position: 'absolute', top: 120 }}>
        <View style={styles.buttons}>
          {!asked ? (
            <Formik
              key={asked}
              initialValues={{ email: '' }}
              onSubmit={({ email }) => {
                forgotPassword.mutate(
                  { email },
                  {
                    onSuccess: () => {
                      setEmail(email);
                      setAsked(true);
                    },
                  }
                );
              }}
              validationSchema={AskSchema}
            >
              {({ handleSubmit }) => (
                <View>
                  <EmailIcon
                    style={{
                      position: 'relative',
                      bottom: -50,
                      left: 15,
                      elevation: 0,
                      height: 20,
                    }}
                  />
                  <TextInput
                    name="email"
                    style={styles.input}
                    placeholder="Correo electrónico"
                  />

                  <Spacer size={15} />

                  <Button
                    type="secondary"
                    onPress={handleSubmit}
                    style={{ fontWeight: "900", textTransform: 'uppercase' }}
                    disabled={forgotPassword.isLoading}
                  >
                    Solicitar código
                  </Button>
                </View>
              )}
            </Formik>
          ) : (
            <Formik
              key={asked}
              initialValues={{ email, password: '', token: '' }}
              onSubmit={({ email, password, token }) => {
                resetPassword.mutate(
                  { email, password, token },
                  {
                    onSuccess: () => {
                      Toast.show({
                        type: 'success',
                        text1: 'Contraseña cambiada',
                        position: 'bottom',
                        visibilityTime: 500,
                        onHide: () => {
                          navigation.navigate('LogIn');
                        },
                      });
                    },
                    onError: () => {
                      Toast.show({
                        type: 'error',
                        text1: 'No hemos podido actualizar tu contraseña',
                        position: 'bottom',
                        visibilityTime: 500,
                      });
                    },
                  }
                );
              }}
              validationSchema={ResetSchema}
            >
              {({ handleSubmit }) => (
                <View>
                  <Text
                    style={{
                      marginBottom: 20,
                      textAlign: 'center',
                      fontSize: 18,
                    }}
                  >
                    Te enviamos un código a tu correo electrónico
                  </Text>

                  <TextInputLine
                    label="Correo electrónico"
                    name="email"
                    placeholder="Correo electrónico"
                  />

                  <TextInputLine
                    label="Nueva contraseña"
                    name="password"
                    placeholder="Contraseña"
                  />

                  <TextInputLine
                    keyboardType="number"
                    label="Código de reseteo"
                    name="token"
                    placeholder="Código de reseteo"
                  />

                  <View>
                    <Button
                      type="secondary"
                      onPress={handleSubmit}
                      disabled={resetPassword.isLoading}
                    >
                      Cambiar contraseña
                    </Button>
                  </View>
                </View>
              )}
            </Formik>
          )}
        </View>
      </View>
    </View>
  );
}

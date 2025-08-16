import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import EmailIcon from '../assets/icons/email.svg';
import PassIcon from '../assets/icons/pass_icon.svg';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Spacer from '../components/Spacer';
import config from '../config/config';
import Layout from '../constants/Layout';
import { useGlobalState } from '../context/GlobalStateContext';
import useStoredState from '../hooks/useStoredState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#e2fef1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttons: {
    height: 200,
    justifyContent: 'space-between',
  },
  iosPadding: {
    top: 20,
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
  button: {
    marginTop: 50,
  },
});

type LoginValues = {
  email: string;
  password: string;
};

export default function LogInScreen({ navigation }) {
  const [{ value: token }, setToken] = useStoredState('token', { value: null });
  const { setGlobalState } = useGlobalState();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const forgotPassword = () => navigation.navigate('ForgotPassword');
  const SignUp = () => navigation.navigate('SignUp');

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Correo electrónico inválido')
      .required('requerido'),
    password: Yup.string()
      .min(5, 'Al menos 5 caracteres')
      .required('requerido'),
  });

  const { isLoading, isError, error, mutate } = useMutation(
    'login',
    ({ email, password }: LoginValues) => {
      const body = new FormData();
      body.append('email', email);
      body.append('password', password);

      return axios.post(`${config.BASE_ENDPOINT}/auth/login`, body);
    },
    {
      onSuccess: async (response) => {
        setToken({ value: response.data.access_token });
        setGlobalState({ loggedIn: true, token: response.data.access_token });
      },
    }
  );

  const renderBackButton =
    navigation.getState().type !== 'tab' && navigation.canGoBack() ? (
      <View
        style={{
          position: 'absolute',
          top: 63,
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
    <View
      style={[
        styles.container,
        Platform.OS === 'ios' ? styles.iosPadding : null,
      ]}
    >
      {renderBackButton}
      <Text
        style={{
          fontSize: 25,
          fontWeight: '900',
          color: '#434343',
          position: 'absolute',
          top: 55,
          marginBottom: 15,
        }}
      >
        ¡Hola!
      </Text>
      <View style={isKeyboardVisible && { position: 'absolute', top: 120 }}>
        <View style={{ alignItems: 'center' }}>
          {isError && (
            <ErrorMessage
              message="El correo ó la contraseña son incorrectos"
              error={error}
            />
          )}
        </View>
        <View style={styles.buttons}>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values: LoginValues) => mutate(values)}
            validationSchema={LoginSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <View>
                  <EmailIcon
                    style={{
                      position: 'relative',
                      bottom: -50,
                      zIndex: 1,
                      left: 15,
                      elevation: 0,
                      height: 20,
                    }}
                  />
                  <TextInput
                    keyboardType="email-address"
                    style={styles.input}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholderTextColor="#ccc"
                    placeholder="Correo electrónico"
                  />

                  <ErrorMessage message={touched.email && errors.email} />
                </View>

                <View style={{ marginTop: -20 }}>
                  <PassIcon
                    style={{
                      position: 'relative',
                      bottom: -45,
                      left: 20,
                      elevation: 0,
                      zIndex: 1,
                      height: 20,
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    autoCompleteType="password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholderTextColor="#ccc"
                    placeholder="Contraseña"
                  />

                  <ErrorMessage message={touched.password && errors.password} />
                </View>
                <Spacer size={15} />

                <View>
                  <Button
                    type="secondary"
                    style={{
                      fontWeight: '900',
                      textTransform: 'uppercase',
                    }}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                  </Button>
                </View>
              </View>
            )}
          </Formik>
          <Spacer size={25} />

          <Button
            style={{ justifyContent: 'space-around' }}
            onPress={forgotPassword}
          >
            <Text style={{ textAlign: 'center', fontSize: 15 }}>
              He olvidado mi contraseña
            </Text>
          </Button>

          <Button onPress={SignUp}>
            <Text style={{ textAlign: 'center', fontSize: 15 }}>
              No tengo cuenta
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

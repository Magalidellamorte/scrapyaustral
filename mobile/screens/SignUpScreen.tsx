import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import AddressForm from '../components/AddressForm';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Spacer from '../components/Spacer';
import { useGlobalState } from '../context/GlobalStateContext';
import useLogin from '../services/useLogin';
import useLocalidadesList from '../services/useLocalidadesList';

import axios from 'axios';
import 'yup-phone';
import SelectLine from '../components/fields/SelectLine';
import TextInputLine from '../components/fields/TextInputLine';
import config from '../config/config';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    marginTop: 5,
  },
});

type RegisterValues = {
  firstName: string;
  lastName: string;
  whatsapp: string;
  email: string;
  password: string;
  company_title: string;
  user_type: string;
  localidad_id: number;
};

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { globalState } = useGlobalState();
  const login = useLogin();
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const { data: localidadesData } = useLocalidadesList();

  React.useEffect(() => {
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

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('requerido'),
    lastName: Yup.string().required('requerido'),
    email: Yup.string()
      .email('Correo electrónico invalido')
      .required('requerido'),
    whatsapp: Yup.string()
      .phone('AR', true, 'Número de WhatsApp inválido')
      .required('requerido'),
    password: Yup.string()
      .min(5, 'Al menos 5 caracteres')
      .required('requerido'),
    user_type: Yup.string().required('requerido'),
    localidad_id: Yup.number()
      .required('Debes seleccionar una localidad')
      .min(1, 'Debes seleccionar una localidad'),
    company_title: Yup.string().when('user_type', {
      is: (val: string) => val === 'comercio' || val === 'industria',
      then: Yup.string().required('requerido'),
      otherwise: Yup.string(),
    }),
  });

  const { isLoading, isError, error, mutate } = useMutation(
    'register',
    ({
      firstName,
      lastName,
      email,
      password,
      whatsapp,
      user_type,
      company_title,
      localidad_id,
    }: // address,
    RegisterValues) => {
      const body = new FormData();
      body.append('first_name', firstName);
      body.append('last_name', lastName);
      body.append('email', email);
      body.append('password', password);
      body.append('whatsapp', whatsapp);
      body.append('user_type', user_type);
      body.append('company_title', company_title);
      body.append('localidad_id', localidad_id.toString());
      if (globalState.expoPushToken) {
        body.append('player_id', globalState.expoPushToken);
      }

      return axios.post(`${config.BASE_ENDPOINT}/auth/register`, body);
    },
    {
      onSuccess: async (r) => {
        const dataRegister = r.config.data._parts;
        const password = dataRegister[3][1];
        const email = dataRegister[2][1];

        Toast.show({
          type: 'success',
          text1: '¡Cuenta creada correctamente!',
          position: 'bottom',
          visibilityTime: 500,
          onHide: () => {},
        });

        login.mutate({ email, password });
      },
    }
  );

  const renderBackButton =
    navigation.getState().type !== 'tab' && navigation.canGoBack() ? (
      <View
        style={{
          position: 'absolute',
          top: 15,
          left: 10,
          zIndex: 1000,
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

  const localidadesOptions = localidadesData?.data?.map(
    (localidad: { id: number; nombre: string;}) => ({
      label: localidad.nombre,
      value: localidad.id,
    })
  ) || [];

  return (
    <>
      <SafeAreaView />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {renderBackButton}
            <Text
              style={{
                fontSize: 25,
                fontWeight: '900',
                color: '#434343',
                position: 'absolute',
                top: 15,
                marginBottom: 15,
                textAlign: 'center',
                width: '100%',
              }}
            >
              Registrate
            </Text>
            <View>
              <View style={{ width: '100%', padding: 20, marginTop: 60 }}>
                <Formik
                  initialValues={{
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    password: '',
                    whatsapp: '',
                    address: AddressForm.getInitialValues(),
                    user_type: '',
                    company_title: '',
                    localidad_id: 0,
                  }}
                  onSubmit={(values: RegisterValues) => mutate(values)}
                  validationSchema={RegisterSchema}
                  style={{ width: '100%' }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <View style={{ width: '100%' }}>
                      <View style={{ width: '100%' }}>
                        <SelectLine
                          label="Localidad"
                          placeholder="Selecciona una localidad"
                          name="localidad_id"
                          options={localidadesOptions}
                          disabled={!localidadesData}
                        />
                      </View>

                      <View style={{ width: '100%' }}>
                        <SelectLine
                          label="Tipo de Usuario"
                          placeholder=""
                          name="user_type"
                          options={[
                            // { label: 'Industria', value: 'industria' },
                            { label: 'Hogar', value: 'hogar' },
                            { label: 'Comercio', value: 'comercio' },
                            { label: 'Institución', value: 'institucion' },
                          ]}
                        />
                      </View>

                      {values.user_type === 'comercio' && (
                        <View>
                          <TextInputLine
                            name="company_title"
                            label="Nombre de comercio"
                            placeholder=""
                            placeholderLine=""
                          />
                        </View>
                      )}

                      {values.user_type === 'industria' && (
                        <View>
                          <TextInputLine
                            name="company_title"
                            label="Nombre de la empresa"
                            placeholder=""
                            placeholderLine=""
                          />
                        </View>
                      )}

                      <>
                        <View>
                          <TextInputLine
                            name="firstName"
                            label="Nombre"
                            placeholder=""
                            placeholderLine=""
                          />
                        </View>

                        <View>
                          <TextInputLine
                            name="lastName"
                            label="Apellido"
                            placeholder=""
                            placeholderLine=""
                          />
                        </View>
                      </>

                      <View>
                        <TextInputLine
                          name="whatsapp"
                          label="Whatsapp"
                          placeholder=""
                          placeholderLine=""
                        />
                      </View>

                      <View>
                        <TextInputLine
                          name="email"
                          label="Correo electrónico"
                          placeholder=""
                          placeholderLine=""
                        />
                      </View>

                      <View>
                        <TextInputLine
                          name="password"
                          label="Contraseña"
                          placeholder=""
                          placeholderLine=""
                        />
                      </View>

                      {isError && (
                        <ErrorMessage
                          message="Hubo un error al crear la cuenta"
                          error={error}
                        />
                      )}
                      <Spacer size={15} />

                      <View style={styles.button}>
                        <Button
                          type="secondary"
                          onPress={handleSubmit}
                          style={{
                            fontWeight: '900',
                            textTransform: 'uppercase',
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Registrando...' : 'Registrarse'}
                        </Button>
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

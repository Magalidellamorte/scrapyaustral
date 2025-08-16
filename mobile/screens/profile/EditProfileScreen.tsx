import axios from 'axios';
import { Formik } from 'formik';
import * as React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import 'yup-phone';
import AddressForm from '../../components/AddressForm';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import ErrorMessage from '../../components/ErrorMessage';
import SelectLine from '../../components/fields/SelectLine';
import TextAreaLine from '../../components/fields/TextAreaLine';
import TextInputLine from '../../components/fields/TextInputLine';
import Header from '../../components/Header';
import Location from '../../components/Location';
import config from '../../config/config';
import Layout from '../../constants/Layout';
import { useGlobalState } from '../../context/GlobalStateContext';
import getProfilePicturePath from '../../helpers/getProfilePicturePath';
import useUser from '../../services/useUser';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  input: {
    width: Layout.window.width - Layout.baseMargin,
    borderRadius: 10,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
  half: {
    width: (Layout.window.width - Layout.baseMargin) / 2,
  },
});

type AddressValues = {
  street: string;
  streetNumber: string;
  postalCode: string;
  floor?: string;
  apartment?: string;
  provinceId: string;
  cityId: string;
  neighborhoodId: string;
};

type RegisterValues = {
  firstName: string;
  user_type: string;
  company_title: string;
  description: string;

  lastName: string;
  whatsapp: string;
  email: string;
  password: string;
  confirm_password: string;
  address: AddressValues;
};

export default function SignUpScreen({ navigation }) {
  const { data: user } = useUser();
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('requerido'),
    lastName: Yup.string().required('requerido'),
    email: Yup.string()
      .email('Correo electrónico invalido')
      .required('requerido'),
    password: Yup.string().min(5, 'Al menos 5 caracteres'),
    user_type: Yup.string().test(
      'is-not-torky',
      'requerido',
      (value) => value === 'torky' || !!value
    ),
    company_title: Yup.string().when('user_type', {
      is: (value) => value === 'comercio' || value === 'industria',
      then: Yup.string().required('requerido'),
      otherwise: Yup.string(),
    }),
    description: Yup.string(),
    whatsapp: Yup.string()
      .phone('AR', true, 'Número de WhatsApp inválido')
      .required('requerido'),
    address: AddressForm.getValidationSchema(),
  });

  const { globalState } = useGlobalState();
  const { token } = globalState;

  const queryClient = useQueryClient();

  const { isLoading, isError, error, mutate } = useMutation(
    'register',
    ({
      firstName,
      lastName,
      whatsapp,
      email,
      password,
      confirm_password,
      user_type,
      company_title,
      description,
      address,
    }: // address,
    RegisterValues) => {
      const body = new FormData();
      body.append('first_name', firstName);
      body.append('last_name', lastName);
      body.append('whatsapp', whatsapp);
      body.append('email', email);
      body.append('user_type', user_type);
      body.append('company_title', company_title);
      body.append('description', description);

      if (password) {
        body.append('password', password);
        body.append('confirm_password', confirm_password);
      }

      if (address.street) body.append('address[street]', address.street);
      if (address.streetNumber)
        body.append('address[street_number]', address.streetNumber);
      if (address.floor) body.append('address[floor]', address.floor);
      if (address.apartment)
        body.append('address[apartment]', address.apartment);

      if (address.latitude) body.append('address[latitude]', address.latitude);
      if (address.longitude)
        body.append('address[longitude]', address.longitude);

      if (address.postalCode)
        body.append('address[postal_code]', address.postalCode);

      if (address.province) body.append('address[province]', address.province);

      if (address.city) body.append('address[city]', address.city);

      if (address.neighborhood && address.neighborhood !== address.province)
        body.append('address[neighborhood]', address.neighborhood);

      return axios.post(`${config.BASE_ENDPOINT}/update_profile`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('user');

        Toast.show({
          type: 'success',
          text1: '¡Perfil actualizado!',
          position: 'bottom',
          visibilityTime: 500,
        });
      },
    }
  );

  console.log(
    'user',
    (user?.data?.is_store
      ? 'comercio'
      : user?.data?.is_company
      ? 'industria'
      : user?.data?.type) || ''
  );

  return (
    <>
      <Header
        rounded
        profilePicture={getProfilePicturePath(user?.data ?? {})}
      />

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.content}>
            <View>
              <Formik
                initialValues={{
                  firstName: user?.data?.first_name || '',
                  lastName: user?.data?.last_name || '',
                  whatsapp: user?.data?.whatsapp || '',
                  email: user?.data?.email || '',
                  password: '',
                  confirm_password: '',
                  user_type:
                    (user?.data?.is_store
                      ? 'comercio'
                      : user?.data?.is_company
                      ? 'industria'
                      : user?.data?.type) || '',
                  company_title: user?.data?.company_title || '',
                  description: user?.data?.description || '',
                  address: AddressForm.getInitialValues(user?.data?.address),
                }}
                onSubmit={(values: RegisterValues) => mutate(values)}
                validationSchema={RegisterSchema}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <View>
                      <TextInputLine
                        name="password"
                        label="Cambiar contraseña"
                      />
                    </View>
                    {values.password ? (
                      <>
                        <View>
                          <TextInputLine
                            name="confirm_password"
                            label="Contraseña actual"
                          />
                        </View>
                        <Divider />
                      </>
                    ) : null}
                    <View>
                      <TextInputLine name="firstName" label="Nombre" />
                    </View>
                    <View>
                      <TextInputLine name="lastName" label="Apellido" />
                    </View>
                    {values.user_type !== 'torky' && (
                      <View>
                        <SelectLine
                          label="Tipo de Usuario"
                          placeholder=""
                          name="user_type"
                          options={[
                            { label: 'Industria', value: 'industria' },
                            { label: 'Hogar', value: 'hogar' },
                            { label: 'Comercio', value: 'comercio' },
                          ]}
                        />
                      </View>
                    )}
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
                          label="Nombre de empresa"
                          placeholder=""
                          placeholderLine=""
                        />
                      </View>
                    )}
                    <View>
                      <TextAreaLine
                        placeholderTextColor="#ccc"
                        name="description"
                        placeholder={
                          user?.data?.is_company || user?.data?.is_store
                            ? 'Describe brevemente tu empresa.'
                            : 'Describe brevemente tu perfil.'
                        }
                        value={values.description}
                        label="Descripción"
                        numberOfLines={5}
                      />
                    </View>

                    <View>
                      <Text style={styles.text}>
                        Ubicación
                        {values.address?.street ? (
                          <Text style={{ fontWeight: 'bold' }}>
                            {`: `}
                            {values.address.street}{' '}
                            {values.address.streetNumber}
                            {values.address.neighborhood &&
                              values.address.neighborhood !==
                                values.address.province &&
                              `, ${values.address.neighborhood}`}
                            {values.address.city && `, ${values.address.city}`}
                            {values.address.province &&
                              `, ${values.address.province}`}
                          </Text>
                        ) : null}
                      </Text>

                      <Location
                        receivedAddress={values.address}
                        onAddressSet={(a: any) => {
                          setFieldValue('address', a.address);
                        }}
                        title={
                          values.address?.street
                            ? `Cambiar ubicación`
                            : `Agregar ubicación`
                        }
                      />

                      {touched.address && errors.address ? (
                        <ErrorMessage message={['La dirección es requerida']} />
                      ) : null}
                    </View>

                    <View>
                      <TextInputLine
                        keyboardType="numeric"
                        autoCompleteType="tel"
                        name="whatsapp"
                        label="Whatsapp"
                      />

                      <ErrorMessage message={touched.phone && errors.phone} />
                    </View>
                    <View>
                      <TextInputLine
                        keyboardType="email-address"
                        autoCapitalize="none"
                        name="email"
                        autoCompleteType="email"
                        label="Correo electrónico"
                      />
                    </View>
                    {isError ? (
                      <ErrorMessage
                        message="Hubo un error al crear la cuenta"
                        error={error}
                      />
                    ) : null}
                    <View style={styles.button}>
                      <Button
                        type="secondary"
                        onPress={handleSubmit}
                        disabled={isLoading || !user?.data?.id}
                      >
                        Guardar cambios
                      </Button>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

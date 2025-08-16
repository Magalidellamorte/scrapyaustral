import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import DorsoDni from '../../assets/images/dorso_ok.png';
import FrenteDni from '../../assets/images/frente_ok.png';
import AddPicturePost from '../../components/AddPicturePost';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import Header from '../../components/Header';
import Spacer from '../../components/Spacer';
import Title from '../../components/Title';
import TextInputLine from '../../components/fields/TextInputLine';
import Layout from '../../constants/Layout';
import useUser from '../../services/useUser';

import config from '../../config/config';
import { useGlobalState } from '../../context/GlobalStateContext';
import getProfilePicturePath from '../../helpers/getProfilePicturePath';

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
  text: {
    color: 'black',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginRight: 20,
    borderRadius: 10,
  },

  Shadow: {
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
    borderRadius: 7,
  },
  dni: {
    width: Layout.window.width - Layout.baseMargin,
    padding: 0,
    height: 250,
    resizeMode: 'contain',
  },
  dniStretch: {
    width: Layout.window.width,
    height: 250,
    padding: 0,
    backgroundColor: '#eee',
    resizeMode: 'stretch',
  },
});

export default function SignUpScreen({ navigation }) {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const [frontImage, setFrontImage] = React.useState();
  const [backImage, setBackImage] = React.useState();

  const pickFront = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled) setFrontImage(result.assets[0]);
  };

  const pickBack = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.3,
    });
    if (!result.canceled) setBackImage(result.assets[0]);
  };

  const company = user?.data?.company_title;
  const requestValidate = user?.data?.request_validate;

  const initialValues = {
    fisca_id: '',
  };

  const BeScraperSchema = Yup.object().shape({
    fiscal_id: company
      ? Yup.string()
          .required('requerido')
          .max(11, 'Debe tener 11 dígitos')
          .min(11, 'Debe tener 11 dígitos')
      : Yup.string().required('requerido'),
  });

  const { isLoading, isError, error, mutate } = useMutation(
    'new-scrap',
    ({ fiscal_id }) => {
      const body = new FormData();
      body.append('fiscal_id', fiscal_id);
      if (frontImage)
        body.append(`document_picture_front_path`, {
          type: 'image/jpeg',
          uri: frontImage.uri,
          name: frontImage.uri.split('/').pop(),
        });

      if (backImage)
        body.append(`document_picture_back_path`, {
          type: 'image/jpeg',
          uri: backImage.uri,
          name: backImage.uri.split('/').pop(),
        });

      return axios.post(`${config.BASE_ENDPOINT}/validate`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('user');
        if (user?.data.scraper) navigation.navigate('Validate');
        else navigation.navigate('Finish');
      },
    }
  );

  return (
    <>
      <Header
        // hideBack
        rounded={false}
        profilePicture={getProfilePicturePath(user?.data ?? {})}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.content}>
            <View>
              {requestValidate === 1 ? (
                <>
                  <View style={{ marginTop: 100 }}>
                    <Text
                      style={{
                        marginTop: 20,
                        fontSize: 18,
                        textAlign: 'center',
                      }}
                    >
                      Solicitud de verificación{' '}
                      <Text style={{ fontWeight: 'bold' }}>pendiente</Text>.
                    </Text>
                    <Text
                      style={{
                        marginTop: 20,
                        fontSize: 15,
                        textAlign: 'center',
                      }}
                    >
                      Tu solicitud esta siendo revisada por nuestro equipo.{' '}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 100,
                      width: '100%',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      type="secondary"
                      style={{ paddingHorizontal: 50 }}
                      onPress={() => {
                        navigation.navigate('Home');
                      }}
                    >
                      Ir al inicio
                    </Button>
                  </View>
                </>
              ) : (
                <>
                  {requestValidate === 2 ? (
                    <>
                      <View style={{ marginTop: 1 }}>
                        <Text style={{ fontSize: 18, textAlign: 'center' }}>
                          Solicitud de verificación{' '}
                          <Text style={{ fontWeight: 'bold' }}>rechazada</Text>.
                        </Text>
                        <Title style={{ marginTop: 50, marginBottom: 20 }}>
                          Volver a validar
                        </Title>
                      </View>
                    </>
                  ) : null}

                  <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => mutate(values)}
                    validationSchema={BeScraperSchema}
                  >
                    {({ handleSubmit, isValid }) => (
                      <View>
                        <View>
                          <TextInputLine
                            name="fiscal_id"
                            label={company ? 'CUIT' : 'DNI'}
                          />
                        </View>
                        <Spacer size={30} />
                        <Title>Documentación</Title>
                        <View>
                          {frontImage ? (
                            <View style={[styles.Shadow, { marginBottom: 5 }]}>
                              <Image
                                key={frontImage.uri}
                                source={{ uri: frontImage.uri }}
                                style={[styles.dniStretch]}
                              />
                            </View>
                          ) : null}
                          <>
                            {company ? (
                              <AddPicturePost
                                style={{ width: '100%' }}
                                label={
                                  frontImage
                                    ? 'Cambiar constancia de cuit'
                                    : 'Subir constancia de cuit'
                                }
                                onPress={pickFront}
                              />
                            ) : (
                              <>
                                {frontImage ? null : (
                                  <View
                                    style={[styles.Shadow, { marginBottom: 5 }]}
                                  >
                                    <Image
                                      source={FrenteDni}
                                      style={[styles.dni]}
                                    />
                                  </View>
                                )}
                                <AddPicturePost
                                  label={
                                    frontImage
                                      ? 'Cambiar frente'
                                      : 'Subir frente'
                                  }
                                  onPress={pickFront}
                                />
                              </>
                            )}
                          </>
                        </View>

                        {frontImage && !company && (
                          <View style={{ marginTop: 20 }}>
                            {backImage ? (
                              <View
                                style={[styles.Shadow, { marginBottom: 5 }]}
                              >
                                <Image
                                  key={backImage.uri}
                                  source={{ uri: backImage.uri }}
                                  style={[styles.dniStretch]}
                                />
                              </View>
                            ) : null}

                            {backImage ? null : (
                              <View style={styles.Shadow}>
                                <Image source={DorsoDni} style={[styles.dni]} />
                              </View>
                            )}
                            <AddPicturePost
                              label={
                                backImage ? 'Cambiar dorso' : 'Subir dorso'
                              }
                              onPress={pickBack}
                            />
                          </View>
                        )}
                        {isError && (
                          <ErrorMessage
                            message="Hubo un error al validar tu cuenta"
                            error={error}
                          />
                        )}

                        <View style={styles.button}>
                          <Button
                            type="secondary"
                            onPress={handleSubmit}
                            disabled={
                              !frontImage ||
                              (!backImage && !company) ||
                              !isValid ||
                              isLoading ||
                              !token
                            }
                          >
                            {isLoading ? 'Finalizando...' : 'Finalizar'}
                          </Button>
                        </View>
                      </View>
                    )}
                  </Formik>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

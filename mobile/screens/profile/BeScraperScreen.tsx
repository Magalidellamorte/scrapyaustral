import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import get from 'lodash/get';
import * as React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import AddressForm from '../../components/AddressForm';
import Button from '../../components/Button';
import SelectMultipleLine from '../../components/fields/SelectMultipleLine';
import TextAreaLine from '../../components/fields/TextAreaLine';
import TextInputLine from '../../components/fields/TextInputLine';
import Header from '../../components/Header';
import Location from '../../components/Location';
import Slider from '../../components/Slider';
import Spacer from '../../components/Spacer';
import Layout from '../../constants/Layout';
import useCategoryList from '../../services/useCategoryList';
import useUser from '../../services/useUser';

import AddPicture from '../../components/AddPicture';
import ErrorMessage from '../../components/ErrorMessage';

import WeekCalendar from '../../components/WeekCalendar';
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
    resizeMode: 'stretch',
  },
});

export default function SignUpScreen({ navigation, route }) {
  const { globalState } = useGlobalState();
  const { token } = globalState;
  const userParam = route.params?.user || null;
  const { data: user } = useUser();

  const queryClient = useQueryClient();

  const categoriesQuery = useCategoryList();

  const categoriesOptions = get(categoriesQuery, 'data.data', []).map(
    (item: { name: ''; id: null }) => ({
      label: item.name,
      value: item.id,
    })
  );

  const [range, setRange] = React.useState(user?.data?.coverage_range ?? 0);
  const [images, setImages] = React.useState([]);
  const [type, setType] = React.useState(
    userParam ? (user?.data.is_company ? 'company' : 'person') : ''
  );
  const [goTo, setGoTo] = React.useState('Home');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0]]);
    }
  };

  const initialValues = {
    company_title: userParam ? user.data.company_title : '',
    description: userParam ? user.data.description : '',
    categories: userParam ? user.data.categories : [],
    availabilities: userParam ? user.data.availabilities : [],
    address: AddressForm.getInitialValues(user?.data?.address),
  };

  const BeScraperSchema = Yup.object().shape({
    // description: Yup.string().required('requerido'),
    categories: Yup.array().min(1, 'requerido'),
    availabilities: Yup.array().min(1, 'requerido'),
  });

  const { isLoading, isError, error, mutate } = useMutation(
    'new-scrap',
    (data) => {
      // {
      //   "address": {"apartment": "undefined", "city": "Capital", "floor": "undefined", "latitude": "-31.403771", "longitude": "-64.2199061", "neighborhood": "Córdoba", "postalCode": "null", "province": "Córdoba", "street": "9 de Julio", "streetNumber": "12121"},
      //    "availabilities": [{"created_at": "2023-04-12T22:32:37.000000Z", "day_index": 1, "from": "14:30", "id": 42, "to": null, "updated_at": "2023-04-12T22:32:37.000000Z", "user_id": 3},
      //    {"created_at": "2023-04-12T22:32:37.000000Z", "day_index": 2, "from": "04:30", "id": 43, "to": null, "updated_at": "2023-04-12T22:32:37.000000Z", "user_id": 3}],
      //  "categories": [{"enabled": "1", "id": 2, "name": "Cartón", "pivot": [Object]}], "company_title": "null", "description": "amm"}

      const body = new FormData();
      body.append('company_title', data?.company_title);
      body.append('description', data?.description);
      body.append('is_company', type === 'company');

      data.categories?.map((categoryToAdd: string) => {
        body.append('categories[]', categoryToAdd);
      });

      data.availabilities.forEach((availability, index) => {
        if (availability.dayNumber) {
          body.append(
            `availabilities[${index}][day_index]`,
            availability.dayNumber
          );
          body.append(`availabilities[${index}][from]`, availability.from);
          body.append(`availabilities[${index}][to]`, availability.to);
        }
      });

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

      if (images.length > 0) {
        images.forEach((image, index) => {
          body.append(`images[${index}]`, {
            type: 'image/jpeg',
            uri: image.uri,
            name: image.uri.split('/').pop(),
          });
        });
      }

      return axios.post(`${config.BASE_ENDPOINT}/upgrade`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('user');
        navigation.navigate(goTo);
      },
      onError: (err) => {
        console.log('err1', err);
      },
    }
  );

  const pickType = (type: string) => {
    setType(type);
  };
  const removePhoto = (uriFilter: any) =>
    setImages(images.filter((image) => image.uri !== uriFilter && image));

  return (
    <>
      {userParam ? (
        <Header rounded={false} />
      ) : (
        <Header
          rounded
          profilePicture={getProfilePicturePath(user?.data ?? {})}
        />
      )}

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.content}>
            <View>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => mutate(values)}
                validationSchema={BeScraperSchema}
              >
                {({ setFieldValue, handleSubmit, values, isValid }) => (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        display: 'flex',
                        width: '100%',
                        marginBottom: 30,
                        flex: 1,
                      }}
                    >
                      <Pressable
                        style={{
                          width: '100%',
                          alignContent: 'center',
                          alignItems: 'center',
                          flex: 0.5,
                          padding: 10,
                          backgroundColor:
                            type === 'person' ? '#49DA8B' : '#eee',
                          marginRight: 10,
                          borderRadius: 5,
                        }}
                        onPress={() => pickType('person')}
                      >
                        <Text>Persona</Text>
                      </Pressable>
                      <Pressable
                        style={{
                          width: '100%',
                          borderRadius: 5,
                          padding: 10,
                          alignItems: 'center',
                          alignContent: 'center',
                          flex: 0.5,
                          backgroundColor:
                            type === 'company' ? '#49DA8B' : '#eee',
                        }}
                        onPress={() => pickType('company')}
                      >
                        <Text>Empresa</Text>
                      </Pressable>
                    </View>

                    {type === 'company' && (
                      <View>
                        <TextInputLine
                          name="company_title"
                          value={values.company_title}
                          label="Nombre de la empresa"
                        />
                      </View>
                    )}

                    <View>
                      <SelectMultipleLine
                        name="categories"
                        placeholder="Selecciona las categorías"
                        label="Categorías"
                        value={values.categories.map((cat) => {
                          if (!cat.id) return cat;
                          return cat.id;
                        })}
                        options={categoriesOptions}
                      />
                    </View>

                    <View>
                      <TextAreaLine
                        placeholderTextColor="#ccc"
                        name="description"
                        placeholder="Describe brevemente tu empresa ó perfil."
                        value={values.description}
                        label="Descripción"
                        numberOfLines={5}
                      />
                    </View>

                    <Text style={styles.text}>
                      Ubicación
                      {values.address?.street ? (
                        <Text style={{ fontWeight: 'bold' }}>
                          {`: `}
                          {values.address.street} {values.address.streetNumber}
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
                    <Spacer size={30} />

                    <Text style={styles.text}>Disponibilidad para retiros</Text>

                    <Spacer size={10} />

                    <WeekCalendar name="availabilities" />
                    <Spacer size={30} />

                    <View
                      style={{
                        paddingVertical: 10,
                      }}
                    >
                      <Text style={styles.text}>
                        Rango de cobertura:{' '}
                        <Text style={{ fontWeight: '900' }}>
                          {range === 100 ? `+${range}` : range}km
                        </Text>
                      </Text>

                      <Slider
                        min={0}
                        value={range}
                        max={100}
                        step={1}
                        setValue={setRange}
                      />
                    </View>

                    <Spacer size={30} />

                    <View>
                      <Text style={[styles.text, { paddingBottom: 20 }]}>
                        Fotos de trabajos (opcional)
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                      >
                        {images.map(({ uri }) => (
                          <View key={uri} style={{ position: 'relative' }}>
                            <Pressable
                              onPress={() => removePhoto(uri)}
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 30,
                                zIndex: 99,
                                backgroundColor: '#DC5F5C',
                                width: 35,
                                height: 35,
                                borderRadius: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <FontAwesome
                                name="trash"
                                size={18}
                                color="#fff"
                              />
                            </Pressable>
                            <Image
                              key={uri}
                              source={{ uri }}
                              style={styles.image}
                            />
                          </View>
                        ))}

                        {images.length < 6 ? (
                          <AddPicture onPress={pickImage} />
                        ) : null}
                      </View>
                    </View>

                    {isError && (
                      <ErrorMessage
                        message="Hubo un error actualizar tu cuenta"
                        error={error}
                      />
                    )}

                    <View style={styles.button}>
                      <Button
                        type="secondary"
                        onPress={() => {
                          if (userParam) setGoTo('Home');
                          else setGoTo('Finish');

                          handleSubmit();
                        }}
                        disabled={(!range || !isValid || isLoading) && !type}
                      >
                        {userParam
                          ? 'Guardar'
                          : isLoading
                          ? 'Finalizando...'
                          : 'Finalizar'}
                      </Button>

                      {!isLoading && !userParam ? (
                        <>
                          <Spacer size={30} />
                          <Button
                            type="secondary"
                            onPress={() => {
                              setGoTo('Validate');
                              handleSubmit();
                            }}
                            disabled={
                              (!range || !isValid || isLoading) && !type
                            }
                          >
                            Finalizar y Validar cuenta
                          </Button>
                        </>
                      ) : null}
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

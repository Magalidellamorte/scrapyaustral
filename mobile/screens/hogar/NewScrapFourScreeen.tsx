import axios from 'axios';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useMutation, useQueryClient } from 'react-query';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import Header from '../../components/Header';
import SectionTitle from '../../components/SectionTitle';
import Spacer from '../../components/Spacer';
import Steps from '../../components/StepsHogar';
import SelectLine from '../../components/fields/SelectLine';
import config from '../../config/config';
import { useGlobalState } from '../../context/GlobalStateContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  iosPadding: {
    paddingBottom: 10,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  subtitle2: {
    fontSize: 16,
    marginLeft: 15,
    color: '#757575',
    width: '80%',
  },
});

type AddressValues = {
  street: string;
  streetNumber: string;
  postalCode: string;
  floor?: string;
  apartment?: string;
  province: string;
  city: string;
  neighborhood: string;
};

type NewScrapValues = {
  offer_type_id: string;
  category_id: string;
  condition_id: string;
  title: string;
  description: string;
  quantity: string;
  measure_type_id: string;
  value_with_shipping: string;
  value_without_shipping: string;
  pick_by_scraper: boolean;
  pick_by_donor: boolean;
  send_by_client: boolean;
  address: AddressValues;
  torky_pickup_at: string;
  torky_pickup_range: string;
};

export default function NewScrapFourScreen({ navigation, route }) {
  const [isIncomplete, setIsIncomplete] = useState(true);
  const { globalState } = useGlobalState();
  const { token } = globalState;
  const queryClient = useQueryClient();

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          // Alert.alert('Permisos necesarios', 'Necesitamos los permisos solicitados');
          // alert('Necesitamos estos permisos para poder continuar!');
        }
      }
    })();
  }, []);

  const {
    title,
    offer_type_id,
    categories,
    dataCategories,
    images,
    description,
    address,
  } = route.params;

  const initialValues = {
    title,
    offer_type_id,
    categories,
    dataCategories,
    images,
    description,
    address,
  };

  const { isLoading, isError, error, mutate } = useMutation(
    'new-scrap',
    ({
      title,
      offer_type_id,
      categories,
      dataCategories,
      images,
      description,
      address,
      torky_pickup_at,
      torky_pickup_range,
    }: NewScrapValues) => {
      // body.append('offer_type_id', offer_type_id);
      // body.append('categories', categories);
      // body.append('dataCategories', dataCategories);
      // body.append('images', images);
      // body.append('address', address);
      // if (address.street) body.append('address[street]', address.street);
      // if (address.streetNumber)
      //   body.append('address[street_number]', address.streetNumber);
      // if (address.floor) body.append('address[floor]', address.floor);
      // if (address.apartment)
      //   body.append('address[apartment]', address.apartment);

      // if (address.latitude) body.append('address[latitude]', address.latitude);
      // if (address.longitude)
      //   body.append('address[longitude]', address.longitude);

      // if (address.postalCode)
      //   body.append('address[postal_code]', address.postalCode);

      // if (address.province) body.append('address[province]', address.province);

      // if (address.city) body.append('address[city]', address.city);

      // if (address.neighborhood && address.neighborhood !== address.province)
      //   body.append('address[neighborhood]', address.neighborhood);

      // images.forEach((image, index) => {
      //   body.append(`images[${index}]`, {
      //     type: 'image/jpeg',
      //     uri: image.uri,
      //     name: image.uri.split('/').pop(),
      //   });
      // });

      // categories.forEach((category, index) => {
      //   body.append(`categories[${index}]`, category);
      // });

      // dataCategories.forEach((dataCategory, index) => {
      //   body.append(`dataCategories[${index}]`, JSON.stringify(dataCategory));
      // });

      // body.append('torky_pickup_at', torky_pickup_at);
      // body.append('torky_pickup_range', torky_pickup_range);

      const body = new FormData();
      body.append('offer_type_id', offer_type_id);
      body.append('address', JSON.stringify(address));
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

      images.forEach((image, index) => {
        body.append(`images[${index}]`, {
          type: 'image/jpeg',
          uri: image.uri,
          name: image.uri.split('/').pop(),
        });
      });

      body.append('torky_pickup_at', torky_pickup_at);
      body.append('torky_pickup_range', torky_pickup_range);

      return axios.post(`${config.BASE_ENDPOINT}/offers.torky`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('own_offers');
        navigation.navigate('Thanks');
        // Toast.show({
        //   type: 'success',
        //   text1: '¡Anuncio creado correctamente!',
        //   position: 'bottom',
        //   visibilityTime: 500,
        //   onHide: () => {
        //   },
        // });
      },
      onError: (error) => {
        console.log('Error al publicar el anuncio:', error.message);
        if (error.response) {
          console.log('Datos del error:', error.response.data);
          console.log('Estado del error:', error.response.status);
          console.log('Encabezados del error:', error.response.headers);
        } else if (error.request) {
          console.log('No se recibió respuesta:', error.request);
        } else {
          console.log('Error al configurar la solicitud:', error.message);
        }
      },
    }
  );

  const [date, setDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate, setFieldValue) => {
    setDate(selectedDate);
    setFieldValue('torky_pickup_at', selectedDate.toISOString());
    hideDatePicker();
  };

  return (
    <>
      <Header title="Publicar scrap" rounded={false} />

      <Formik
        initialValues={initialValues}
        onSubmit={(values: NewScrapValues) => mutate(values)}
      >
        {({ setFieldValue, handleSubmit, values }) => {
          React.useEffect(() => {
            if (values.torky_pickup_at && values.torky_pickup_range) {
              setIsIncomplete(false);
            } else {
              setIsIncomplete(true);
            }
          }, [values.torky_pickup_at, values.torky_pickup_range]);

          return (
            <>
              <ScrollView>
                <View style={styles.content}>
                  <Steps type={offer_type_id} step={4} />
                  <Spacer size={10} />

                  <View>
                    <SectionTitle
                      icon="calendar"
                      title="Día de entrega"
                      subtitle="Selecciona el día en el que el puedan retirar el material."
                    />
                    <Spacer size={5} />
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(
                          'https://www.google.com/maps/d/u/0/viewer?mid=1tUnB9sjETM2-gDvICxQ4LrccsZLaFYo&ll=-34.09889484410688%2C-59.03249430000001&z=14'
                        );
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#757575',
                        }}
                      >
                        Consulta nuestro mapa para optimizar el retiro.
                      </Text>
                    </TouchableOpacity>

                    <Spacer size={20} />

                    <Button onPress={showDatePicker} type="borderSmall">
                      {date
                        ? `${date.toLocaleDateString()}`
                        : 'Seleccionar fecha'}
                    </Button>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      minimumDate={new Date()}
                      onConfirm={(selectedDate) =>
                        handleConfirm(selectedDate, setFieldValue)
                      }
                      onCancel={hideDatePicker}
                    />
                    <Spacer size={20} />
                  </View>
                  <View>
                    <SectionTitle
                      icon="clock-o"
                      title="Horario de entrega"
                      subtitle="Selecciona el rango de horario en el que puedan retirar el material."
                    />

                    <Spacer size={10} />

                    <SelectLine
                      placeholder=""
                      name="torky_pickup_range"
                      options={[
                        {
                          label: '8 a 10',
                          value: '8 a 10',
                        },
                        {
                          label: '10 a 12',
                          value: '10 a 12',
                        },
                        {
                          label: '15 a 17',
                          value: '15 a 17',
                        },
                        {
                          label: '17 a 19',
                          value: '17 a 19',
                        },
                      ]}
                      onValueChange={(value) =>
                        setFieldValue('torky_pickup_range', value)
                      }
                    />
                    <Spacer size={20} />
                  </View>
                  {isError && (
                    <ErrorMessage
                      message="Hubo un error al publicar el anuncio"
                      error={error}
                    />
                  )}
                </View>
              </ScrollView>

              <View
                style={[
                  styles.button,
                  Platform.OS === 'ios' ? styles.iosPadding : null,
                ]}
              >
                <Button
                  type="secondary"
                  onPress={handleSubmit}
                  disabled={isLoading || isIncomplete}
                >
                  {isLoading ? 'Publicando...' : 'Publicar'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </>
  );
}

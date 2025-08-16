import axios from 'axios';
import { Formik } from 'formik';
import get from 'lodash/get';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useMutation, useQueryClient } from 'react-query';
import Steps from '../components/Steps';

import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import TextInputLine from '../components/fields/TextInputLine';
import Header from '../components/Header';
import SectionTitle from '../components/SectionTitle';
import Spacer from '../components/Spacer';
import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';
import useConditionList from '../services/useConditionList';
import useMeasureTypeList from '../services/useMeasureTypeList';

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

const mapper = ({ name, id }) => ({
  label: name,
  value: id,
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
};

function TextEnvioVendedor() {
  return (
    <Text style={styles.subtitle2}>
      <Text
        style={{
          marginRight: 10,
          display: 'block',
          color: '#757575',
        }}
      >
        Envío a cargo del vendedor
      </Text>{' '}
      <Text
        style={{
          marginRight: 10,
          display: 'block',
          color: '#FFF',
        }}
      />
      <Text
        style={{
          fontSize: 12,
          paddingLeft: 10,
          display: 'block',
          color: '#757575',
          fontStyle: 'italic',
        }}
      >
        (Sujeto a modificaciones en el precio)
      </Text>
    </Text>
  );
}
function TextEnvioDonante() {
  return <Text style={styles.subtitle2}>Envío a cargo del donante</Text>;
}
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

  const measures = useMeasureTypeList();
  const conditions = useConditionList();

  const measureOptions = get(measures, 'data.data', []).map(mapper);
  const conditionOptions = get(conditions, 'data.data', []).map(mapper);
  // const [images, setImages] = React.useState([]);

  const {
    title,
    offer_type_id,
    category_id,
    images,
    condition_id,
    description,
    quantity,
    measure_type_id,
    pick_by_scraper,
    pick_by_donor,
    send_by_client,
    address,
    value_with_shipping,
    value_without_shipping,
  } = route.params;

  const initialValues = {
    offer_type_id,
    category_id,
    condition_id,
    title,
    description,
    quantity,
    measure_type_id,
    pick_by_scraper,
    pick_by_donor,
    send_by_client,
    address,
    images,
    value_with_shipping,
    value_without_shipping,
  };
  const [pickDonation, setPickDonation] = useState(initialValues);

  if (initialValues.offer_type_id === 1) {
    initialValues.value_with_shipping = '';
    initialValues.value_without_shipping = '';
  }

  useEffect(() => {
    if (initialValues.offer_type_id === 2) {
      if (!pickDonation.pick_by_scraper && !pickDonation.pick_by_donor)
        setIsIncomplete(true);
      else setIsIncomplete(false);
    }
  }, [pickDonation.pick_by_scraper, pickDonation.pick_by_donor]);

  useEffect(() => {
    if (initialValues.offer_type_id === 2) setIsIncomplete(true);
    else setIsIncomplete(false);
  }, []);

  const { isLoading, isError, error, mutate } = useMutation(
    'new-scrap',
    ({
      offer_type_id,
      category_id,
      condition_id,
      title,
      description,
      quantity,
      measure_type_id,
      value_with_shipping,
      value_without_shipping,
      pick_by_scraper,
      pick_by_donor,
      send_by_client,
      address,
    }: NewScrapValues) => {
      const body = new FormData();
      body.append('offer_type_id', offer_type_id);
      body.append('category_id', category_id);
      body.append('condition_id', condition_id);
      body.append('title', title);
      body.append('quantity', quantity);
      body.append('description', description);
      body.append('measure_type_id', measure_type_id);

      if (value_with_shipping) {
        body.append('value_with_shipping', value_with_shipping);
      }

      if (value_without_shipping) {
        body.append('value_without_shipping', value_without_shipping);
      }

      body.append('pick_by_scraper', pick_by_scraper);
      body.append('send_by_client', send_by_client);
      body.append('pick_by_donor', pick_by_donor);
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

      return axios.post(`${config.BASE_ENDPOINT}/offers`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('own_offers');
        navigation.navigate('OwnOffers');
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
        console.log(error);
      },
    }
  );

  return (
    <>
      <Header title="Publicar scrap" rounded={false} />

      <Formik
        initialValues={initialValues}
        onSubmit={(values: NewScrapValues) => mutate(values)}
      >
        {({ setFieldValue, handleSubmit, values }) => (
          <>
            <ScrollView>
              <View style={styles.content}>
                <Steps type={offer_type_id} step={4} />
                <Spacer size={10} />

                {offer_type_id === 1 ? (
                  <View>
                    <SectionTitle
                      icon="dollar"
                      title={`Valor esperado ${
                        values?.measure_type_id
                          ? `por ${
                              measureOptions.find(
                                (mo) => mo.value === values?.measure_type_id
                              )?.label
                            }`
                          : ''
                      }`}
                      subtitle="Coloque el valor esperado por el material publicado. Esto ayudará a los scrapers a realizar sus ofertas."
                    />
                    <Spacer size={20} />

                    <Text style={{ color: '#999', fontStyle: 'italic' }}>
                      Este valor no incluye transporte del material.
                    </Text>

                    <Spacer size={5} />

                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <TextInputLine
                          keyboardType="numeric"
                          placeholder="$0"
                          placeholderTextColor="#ccc"
                          name="value_with_shipping"
                          label="Valor"
                        />
                      </View>

                      {/* <View style={{ flex: 0.5 }}>
                        <TextInputLine
                          keyboardType="numeric"
                          name="value_without_shipping"
                          label="Sin retiro"
                        />
                      </View> */}
                    </View>

                    <Spacer size={20} />
                  </View>
                ) : null}
                <View>
                  <SectionTitle
                    icon={offer_type_id === 1 ? 'truck' : 'gift'}
                    title={`Retiro del material${
                      offer_type_id === 1 ? '' : ' a donar'
                    }`}
                    subtitle="Colocar a quien corresponde el envío/retiro del material. si ambas opciones son posibles , podrás seleccionar las dos . Esto ayudará a los scrapers a realizar sus ofertas."
                  />

                  <Spacer size={20} />

                  <BouncyCheckbox
                    size={25}
                    fillColor="#49DA8B"
                    unfillColor="#FFFFFF"
                    text={
                      offer_type_id === 1
                        ? 'Retiro a cargo del comprador'
                        : 'Retiro a cargo del interesado'
                    }
                    iconStyle={{ borderColor: '#49DA8B' }}
                    onPress={(isChecked: boolean) => {
                      setFieldValue('pick_by_scraper', isChecked);
                      setPickDonation({
                        ...pickDonation,
                        pick_by_scraper: isChecked,
                      });
                    }}
                    textStyle={{
                      textDecorationLine: 'none',
                    }}
                  />
                  <Spacer size={10} />

                  <BouncyCheckbox
                    size={25}
                    fillColor="#49DA8B"
                    unfillColor="#FFFFFF"
                    textComponent={
                      offer_type_id === 1 ? (
                        <TextEnvioVendedor />
                      ) : (
                        <TextEnvioDonante />
                      )
                    }
                    iconStyle={{ borderColor: '#49DA8B' }}
                    onPress={(isChecked: boolean) => {
                      setFieldValue('pick_by_donor', isChecked);
                      setPickDonation({
                        ...pickDonation,
                        pick_by_donor: isChecked,
                      });
                    }}
                    textStyle={{
                      textDecorationLine: 'none',
                    }}
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
        )}
      </Formik>
    </>
  );
}

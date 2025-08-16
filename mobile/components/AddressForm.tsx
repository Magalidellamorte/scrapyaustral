import { useFormikContext } from 'formik';
import React, { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Yup from 'yup';

import config from '../config/config';
import TextInputLine from './fields/TextInputLine';
import Title from './Title';

  export const polygonCoordinatesZarate = [
    [-59.03865728317429, -34.095766906711866],
    [-59.02423085781169, -34.088369703578145],
    [-59.01388069514425, -34.1015198400099],
    [-59.02986673405928, -34.107213684787375],
    [-59.03872817469917, -34.095766906711866],
  ];

  export const polygonCoordinatesPinamar = [
    [-56.942619400438915, -37.16882104695791],
    [-56.90183681194493, -37.186037647519534],
    [-56.79326055194558, -37.03957711211976],
    [-56.83485285588239, -37.02793046652138],
    [-56.942619400438915, -37.16882104695791],
  ];

  export const polygonCoordinatesLaPlata = [
    [-58.0860901314002, -34.83125122588456],
    [-58.17274766670141, -34.89727914265926],
    [-58.26478107253614, -34.96321236407471],
    [-58.22020827647128, -35.008246041626435],
    [-58.104030000273895, -35.046794934005554],
    [-57.968482048292174, -35.16779857919706],
    [-57.74714522096704, -34.97316753357985],
    [-57.93455475678269, -34.877435356800994],
    [-58.05743638307608, -34.82989952459922],
    [-58.086127936870554, -34.83111634426208],
  ];

  export function isPointInPolygon(point: any, polygon: any) {
    let isInside = false;
    const x = point.lng,
      y = point.lat;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0],
        yi = polygon[i][1];
      const xj = polygon[j][0],
        yj = polygon[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }
    return isInside;
  }

  const AddressForm = ({ onChangeStep, torky = false }) => {
    const { values, setFieldValue }: any = useFormikContext();
    const [step, setStep] = useState(1);
    const [streetCheck, setStreetCheck] = useState(null);
    const [streetNumberCheck, setStreetNumberCheck] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const googlePlacesRef = useRef(null);

    const getDir = (data: any, types: string) =>
      data.filter((d: any) => d.types.includes(types) && d)[0] || {
        long_name: null,
      };

    const setAddress = (data: any) => {
      const location = {
        lat: data.geometry.location.lat,
        lng: data.geometry.location.lng,
      };
      console.log(location);
      if (torky) {
        if (isPointInPolygon(location, polygonCoordinatesZarate)) {
          alert('La recolección en Zarate se encuentra supendida.');
          return;
        } else if (!isPointInPolygon(location, polygonCoordinatesPinamar) 
            && !isPointInPolygon(location, polygonCoordinatesLaPlata)) {
          if (googlePlacesRef.current) {
            (googlePlacesRef.current as any).setAddressText('');
            (googlePlacesRef.current as any).blur();
          }
          alert('La ubicación seleccionada está fuera del área permitida.');
          return;
        }
      }

      setErrorMessage('');
      setStep(2);
      onChangeStep(2);

      const addressComponents = data.address_components;
      let locality;
      let province;
      const street = getDir(addressComponents, 'route');
      const streetNumber = getDir(addressComponents, 'street_number');
      const postalCode = getDir(addressComponents, 'postal_code');

      let neighborhood = getDir(addressComponents, 'neighborhood');
      if (!neighborhood.long_name) {
        neighborhood = getDir(addressComponents, 'locality');
        locality = getDir(addressComponents, 'administrative_area_level_2');
        province = getDir(addressComponents, 'administrative_area_level_1');
      } else {
        locality = getDir(addressComponents, 'locality');
        province = getDir(addressComponents, 'administrative_area_level_2');
      }
      setStreetCheck(street.long_name);
      setStreetNumberCheck(streetNumber.long_name);
      setFieldValue('address.street', street.long_name);
      setFieldValue('address.streetNumber', streetNumber.long_name);
      setFieldValue('address.neighborhood', neighborhood.long_name);
      setFieldValue('address.city', locality.long_name);
      setFieldValue('address.province', province.long_name);
      setFieldValue('address.latitude', data.geometry.location.lat);
      setFieldValue('address.longitude', data.geometry.location.lng);
      setFieldValue('address.postalCode', postalCode.long_name);
    };

    return (
      <>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
            backgroundColor: step === 1 ? '#ecf0f1' : 'white',
          }}
        >
          {errorMessage && (
            <View
              style={{ padding: 10, marginBottom: 30, backgroundColor: 'red' }}
            >
              <Text style={{ color: 'white' }}>{errorMessage}</Text>
            </View>
          )}

          {step === 1 && (
            <>
              <Title>Buscar dirección</Title>
              <GooglePlacesAutocomplete
                ref={googlePlacesRef}
                placeholder="Dirección o punto de referencia"
                keepResultsAfterBlur
                fetchDetails
                minLength={2}
                query={{
                  key: `${config.MAPS_KEY}`,
                  country: 'ar',
                  fetchDetails: true,
                  language: 'es',
                  types: 'address',
                  components: 'country:ar',
                }}
                enablePoweredByContainer={false}
                onFail={(error) => console.error(error)}
                onPress={(data, details = null) => setAddress(details)}
                styles={{
                  textInput: {
                    height: 44,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 4,
                    paddingHorizontal: 10,
                  },
                }}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Title style={{ marginTop: 20 }}>
                Completá los últimos datos
              </Title>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <TextInputLine
                    editable={!streetCheck}
                    selectTextOnFocus={!streetCheck}
                    name="address.street"
                    label="Calle"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInputLine
                    editable={!streetNumberCheck}
                    selectTextOnFocus={!streetNumberCheck}
                    name="address.streetNumber"
                    label="Nro de puerta"
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <TextInputLine name="address.floor" label="Piso" />
                </View>

                <View style={{ flex: 1 }}>
                  <TextInputLine name="address.apartment" label="Depto" />
                </View>
              </View>
            </>
          )}
        </View>
      </>
    );
  };

AddressForm.getValidationSchema = () =>
  Yup.object().shape({
    street: Yup.string().required('requerido').nullable(),
    streetNumber: Yup.string().required('requerido').nullable(),
    floor: Yup.string().max(2, 'Máximo 2 caracteres').nullable(),
    apartment: Yup.string().max(3, 'Máximo 3 caracteres').nullable(),
  });

AddressForm.getInitialValues = (address?) => ({
  street: address?.street || '',
  streetNumber: address?.street_number || '',
  postalCode: address?.postal_code || '',
  floor: address?.floor || '',
  apartment: address?.apartment || '',
  province: address?.province?.name || '',
  city: address?.city?.name || '',
  neighborhood: address?.neighborhood?.name || '',
  latitude: address?.latitude || '',
  longitude: address?.longitude || '',
});

export default AddressForm;

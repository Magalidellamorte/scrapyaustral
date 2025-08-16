import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import get from 'lodash/get';
import * as React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Yup from 'yup';
import {
  isPointInPolygon,
  polygonCoordinatesLaPlata,
  polygonCoordinatesPinamar,
  polygonCoordinatesZarate,
} from '../../components/AddressForm';
import Button from '../../components/Button';
import SelectLine from '../../components/fields/SelectLine';
import TextInputLine from '../../components/fields/TextInputLine';
import Header from '../../components/Header';
import Location from '../../components/Location';
import SectionTitle from '../../components/SectionTitle';
import Spacer from '../../components/Spacer';
import Steps from '../../components/StepsHogar';
import useConditionList from '../../services/useConditionList';
import useMeasureTypeList from '../../services/useMeasureTypeList';
import useUser from '../../services/useUser';

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
    paddingBottom: 25,
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  titleData: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  titleDataSubtitle: {
    fontSize: 12,
    color: '#808080',
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
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
  provinceId: string;
  cityId: string;
  neighborhoodId: string;
  latitude: string;
  longitude: string;
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
  categories: {
    [categoryId: string]: {
      quantity: string;
      measure_type_id: string;
      condition_id: string;
    };
  };
};

export default function NewScrapSecondScreen({ navigation, route }) {
  const { categories, categoriesFetch, offertType } = route.params;
  const { data: user } = useUser();

  const userAddressDb = user?.data?.address || null;
  const userAddress = {
    address: {
      apartment:
        userAddressDb.apartment === 'undefined'
          ? ''
          : userAddressDb.apartment || '',
      city: userAddressDb.city ? userAddressDb.city.name : '',
      floor:
        userAddressDb.floor === 'undefined' ? '' : userAddressDb.floor || '',
      latitude: userAddressDb.latitude,
      longitude: userAddressDb.longitude,
      neighborhood: userAddressDb.neighborhood
        ? userAddressDb.neighborhood.name
        : '',
      postalCode: userAddressDb.postalCode,
      province: userAddressDb.province ? userAddressDb.province.name : '',
      street: userAddressDb.street,
      streetNumber: userAddressDb.street_number,
    },
  };

  const initialValues = {
    offer_type_id: offertType,
    categories: categories,
    title: '',
    description: '',
    address: userAddress,
    dataCategories: {},
  };
  const NewScrapSchema = Yup.object().shape({
    // condition_id: Yup.string().required('requerido').nullable(),
    // title: Yup.string().required('requerido').nullable(),
    // description: Yup.string().required('requerido').nullable(),
    // quantity: Yup.string().required('requerido').nullable(),
    // measure_type_id: Yup.string().required('requerido').nullable(),
  });

  const [address, setAddress] = React.useState<AddressValues>(userAddress);
  const [errorAddress, setErrorAddress] = React.useState<Boolean>(false);

  const conditions = useConditionList();
  const conditionOptions = get(conditions, 'data.data', []).map(mapper);

  const measures = useMeasureTypeList();
  const measureOptions = get(measures, 'data.data', []).map(mapper);

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          // alert('Necesitamos estos permisos para poder continuar!');
        }
      }
    })();
  }, []);

  const onSubmit = (values: NewScrapValues) => {
    setErrorAddress(false);
    if (address === undefined) {
      setErrorAddress(true);
    } else {
      const location = {
        lat: address.address.latitude,
        lng: address.address.longitude,
      };

      if (isPointInPolygon(location, polygonCoordinatesZarate)) {
        alert('La recolección en Zarate se encuentra supendida.');
        return;
      } else if (!isPointInPolygon(location, polygonCoordinatesPinamar)
          && !isPointInPolygon(location, polygonCoordinatesLaPlata)) {
        alert('La ubicación seleccionada está fuera del área permitida.');
        return;
      }

      values.address = address.address;
      const selectedCategories = categories.map((category, index) => ({
        category_id: category,
        quantity: values.dataCategories[index]?.quantity || '',
        measure_type_id: values.dataCategories[index]?.measure_type_id || '',
        condition_id: values.dataCategories[index]?.condition_id || '',
      }));

      navigation.navigate('NewScrapThirdHogar', {
        initialValues,
        ...values,
        dataCategories: selectedCategories,
      });
    }
  };

  const setearAddress = (address: AddressValues) => {
    setAddress(address);
  };

  return (
    <>
      <Header title="Publicar scrap" rounded={false} />
      <Formik
        initialValues={initialValues}
        validationSchema={NewScrapSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values }) => (
          <>
            <ScrollView>
              <View style={styles.content}>
                <Steps type={offertType} step={2} />
                <Spacer size={10} />

                {categories &&
                  categories.map((category, index) => {
                    const categoryData = categoriesFetch.find(
                      (c) => c.id === category
                    );

                    return (
                      <View key={index}>
                        <Text style={styles.titleData}>
                          {categoryData.name}
                          <Text style={styles.titleDataSubtitle}>
                            {` `}(opcional)
                          </Text>
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flex: 0.3, paddingEnd: 5 }}>
                            <TextInputLine
                              keyboardType="numeric"
                              name={`dataCategories[${index}].quantity`}
                              label="Cantidad"
                              placeholder="Ej: 10"
                            />
                          </View>

                          {measureOptions ? (
                            <View style={{ flex: 0.5, paddingEnd: 5 }}>
                              <SelectLine
                                label="Unidad"
                                placeholder=""
                                forceLabel
                                name={`dataCategories[${index}].measure_type_id`}
                                options={measureOptions}
                              />
                            </View>
                          ) : null}

                          {conditionOptions ? (
                            <View style={{ flex: 0.6 }}>
                              <SelectLine
                                placeholder=""
                                name={`dataCategories[${index}].condition_id`}
                                label="Estado"
                                options={conditionOptions}
                              />
                            </View>
                          ) : null}

                          <View style={{ display: 'none' }}>
                            <TextInputLine
                              name={`dataCategories[${index}].category_id`}
                              value={`${category}`}
                            />
                          </View>
                        </View>
                        <Spacer size={5} />
                      </View>
                    );
                  })}
                <Spacer size={10} />

                <SectionTitle
                  icon="map-marker"
                  title="Ubicación del material"
                  subtitle=""
                />
                {address ? (
                  <>
                    <Text style={{ marginTop: 0, fontWeight: 'bold' }}>
                      {address.address.street} {address.address.streetNumber}
                      {address.address.neighborhood &&
                        address.address.neighborhood !==
                          address.address.province &&
                        `, ${address.address.neighborhood}`}
                      {address.address.city && `, ${address.address.city}`}
                      {address.address.province &&
                        `, ${address.address.province}`}
                    </Text>
                  </>
                ) : null}

                <Location
                  receivedAddress={address}
                  onAddressSet={setearAddress}
                  errorAddress={errorAddress}
                  torky={true}
                  title={
                    address
                      ? `Cambiar ubicación del material`
                      : `Agregar ubicación del material`
                  }
                />
              </View>
            </ScrollView>
            <View style={styles.button}>
              <View
                style={[
                  styles.button,
                  Platform.OS === 'ios' ? { paddingBottom: 20 } : null,
                ]}
              >
                <Button type="secondary" onPress={handleSubmit}>
                  Siguiente
                </Button>
              </View>
            </View>
          </>
        )}
      </Formik>
    </>
  );
}

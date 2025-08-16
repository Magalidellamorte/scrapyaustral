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
import Button from '../components/Button';
import SelectLine from '../components/fields/SelectLine';
import TextAreaLine from '../components/fields/TextAreaLine';
import TextInputLine from '../components/fields/TextInputLine';
import Header from '../components/Header';
import Location from '../components/Location';
import SectionTitle from '../components/SectionTitle';
import Spacer from '../components/Spacer';
import Steps from '../components/Steps';
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
};

export default function NewScrapSecondScreen({ navigation, route }) {
  const { globalState } = useGlobalState();
  const { token } = globalState;
  const { category, offertType } = route.params;

  const initialValues = {
    offer_type_id: offertType,
    category_id: category,
    condition_id: '',
    title: '',
    description: '',
    quantity: '',
    measure_type_id: '',
    pick_by_scraper: false,
    pick_by_donor: false,
    send_by_client: false,
    address: {},
  };
  const NewScrapSchema = Yup.object().shape({
    condition_id: Yup.string().required('requerido').nullable(),
    title: Yup.string().required('requerido').nullable(),
    description: Yup.string().required('requerido').nullable(),
    quantity: Yup.string().required('requerido').nullable(),
    measure_type_id: Yup.string().required('requerido').nullable(),
  });

  const [address, setAddress] = React.useState<AddressValues>();
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

    if (offertType === 1) {
      initialValues.value_with_shipping = '';
      initialValues.value_without_shipping = '';
    }
  }, []);

  const onSubmit = (values: NewScrapValues) => {
    setErrorAddress(false);
    if (address === undefined) {
      setErrorAddress(true);
    } else {
      values.address = address.address;
      navigation.navigate('NewScrapThird', values);
    }
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
                <TextInputLine name="title" label="Título de la publicación" />

                <TextAreaLine name="description" label="Descripción" />

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 0.3, paddingEnd: 20 }}>
                    <TextInputLine
                      keyboardType="numeric"
                      name="quantity"
                      label="Cantidad"
                      placeholder="Ej: 10"
                    />
                  </View>

                  {measureOptions ? (
                    <View style={{ flex: 0.5, paddingEnd: 20 }}>
                      <SelectLine
                        label="Unidad"
                        placeholder=""
                        forceLabel
                        name="measure_type_id"
                        options={measureOptions}
                      />
                    </View>
                  ) : null}

                  {conditionOptions ? (
                    <View style={{ flex: 0.6 }}>
                      <SelectLine
                        placeholder=""
                        name="condition_id"
                        label="Estado"
                        options={conditionOptions}
                      />
                    </View>
                  ) : null}
                </View>
                <Spacer size={30} />

                <SectionTitle
                  icon="map-marker"
                  title="Ubicación del material"
                  subtitle="Es necesaria para buscar compradores en la zona. No mostraremos tu ubicación exacta."
                />
                {address ? (
                  <>
                    <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
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
                  onAddressSet={setAddress}
                  errorAddress={errorAddress}
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

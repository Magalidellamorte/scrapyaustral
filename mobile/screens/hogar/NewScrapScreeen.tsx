import get from 'lodash/get';
import * as React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Steps from '../../components/StepsHogar';

import Button from '../../components/Button';
import Header from '../../components/Header';
import Spacer from '../../components/Spacer';
import useCategoryList from '../../services/useCategoryList';
import useOfferTypeList from '../../services/useOfferTypeList';

import CablesImg from '../../assets/images/cat/cables.png';
import CartonImg from '../../assets/images/cat/carton.png';
import MaquinariaImg from '../../assets/images/cat/electronico.png';
import MaderaImg from '../../assets/images/cat/madera.png';
import ElectronicosImg from '../../assets/images/cat/maquinaria.png';
import MetalImg from '../../assets/images/cat/metal.png';
import MuebleImg from '../../assets/images/cat/mueble.png';
import PapelImg from '../../assets/images/cat/papel.png';
import PlasticoImg from '../../assets/images/cat/plastico.png';
import TextilImg from '../../assets/images/cat/textil.png';

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

export default function NewScrapScreen({ navigation }) {
  const offerTypes = useOfferTypeList();
  const categoriesFetch = useCategoryList();
  const offertTypeOptions = get(offerTypes, 'data.data', []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const categoriesOptions = get(categoriesFetch, 'data.data', []).map(
    (item) => ({
      label: item.name,
      value: item.id,
    })
  );

  const [offertType, setOffertType] = React.useState(1);
  const [categories, setCategories] = React.useState([]);

  const icons = {
    1: <Image source={MetalImg} style={{ width: 55, height: 50 }} />,
    2: <Image source={CartonImg} style={{ width: 55, height: 50 }} />,
    3: <Image source={MaderaImg} style={{ width: 55, height: 50 }} />,
    4: <Image source={PlasticoImg} style={{ width: 55, height: 50 }} />,
    5: <Image source={TextilImg} style={{ width: 55, height: 50 }} />,
    6: <Image source={MuebleImg} style={{ width: 55, height: 50 }} />,
    7: <Image source={ElectronicosImg} style={{ width: 55, height: 50 }} />,
    8: <Image source={MaquinariaImg} style={{ width: 55, height: 50 }} />,
    9: <Image source={PapelImg} style={{ width: 55, height: 50 }} />,
    10: <Image source={CablesImg} style={{ width: 55, height: 50 }} />,
  };

  const toggleCategory = (value) => {
    setCategories((prevCategories) =>
      prevCategories.includes(value)
        ? prevCategories.filter((category) => category !== value)
        : [...prevCategories, value]
    );
  };

  return (
    <>
      <Header title="Publicar scrap" rounded={false} />

      <ScrollView>
        <View style={styles.content}>
          <Steps type={offertType} step={1} />

          <View style={{ alignItems: 'center', display: 'none' }}>
            <Spacer size={10} />
            <Text style={styles.subtitle}>¿Qué querés hacer con tu Scrap?</Text>
            {offerTypes.isLoading ? <Text>Cargando...</Text> : null}

            <Spacer size={15} />

            <View style={{ flexDirection: 'row' }}>
              {offertTypeOptions.map(({ label, value }) => (
                <View
                  style={{ flex: 1, paddingEnd: label === 'Vender' ? 15 : 0 }}
                  key={value}
                >
                  <Button
                    type={value === offertType ? 'secondary' : 'primary'}
                    onPress={() => {
                      setOffertType(value);
                    }}
                  >
                    {label}
                  </Button>
                </View>
              ))}
            </View>
          </View>
          <Spacer size={35} />
          <Text style={styles.subtitle}>
            Elegí la categoría del material a publicar
          </Text>

          <Spacer size={15} />

          {categories.isLoading ? <Text>Cargando...</Text> : null}

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {categoriesOptions.map(({ label, value }) => (
              <Pressable key={value} onPress={() => toggleCategory(value)}>
                <View style={{ marginBottom: 20, marginRight: 20 }}>
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: categories.includes(value)
                        ? '#e2fef1'
                        : '#f7f7f7',
                      borderWidth: 0,
                      borderRadius: 50,
                      shadowColor: categories.includes(value)
                        ? '#39ce67'
                        : '#000',
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      shadowOpacity: categories.includes(value) ? 0.4 : 0.1,
                      shadowRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {icons[value]}
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 5,
                      textAlign: 'center',
                      width: 100,
                    }}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          styles.button,
          Platform.OS === 'ios' ? { paddingBottom: 20 } : null,
        ]}
      >
        <Button
          type="secondary"
          disabled={!offertType || categories.length === 0}
          onPress={() =>
            navigation.navigate('NewScrapSecondHogar', {
              offertType,
              categoriesFetch: categoriesFetch?.data?.data || [],
              categories,
            })
          }
        >
          Siguiente
        </Button>
      </View>
    </>
  );
}

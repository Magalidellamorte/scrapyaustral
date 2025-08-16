import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import AddPicturePost from '../../components/AddPicturePost';
import Button from '../../components/Button';
import Header from '../../components/Header';
import SectionTitle from '../../components/SectionTitle';
import Spacer from '../../components/Spacer';
import Steps from '../../components/StepsHogar';
import Layout from '../../constants/Layout';

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
  send_by_client: boolean;
  address: AddressValues;
};

export default function NewScrapThirdScreen({ navigation, route }) {
  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { statusMedia } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (statusMedia !== 'granted') {
          // alert('Necesitamos estos permisos para poder continuar!');
        }
        const { statusCamera } =
          await ImagePicker.requestCameraPermissionsAsync();
        if (statusCamera !== 'granted') {
          // alert('Necesitamos estos permisos para poder continuar!');
        }
      }
    })();
  }, []);

  const [images, setImages] = React.useState([]);

  const {
    title,
    offer_type_id,
    categories,
    dataCategories,
    description,
    address,
  } = route.params;

  const initialValues = {
    offer_type_id,
    categories,
    dataCategories,
    title,
    description,
    address,
    images,
  };

  const onSubmit = (values: NewScrapValues) => {
    navigation.navigate('NewScrapFourHogar', initialValues);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled) setImages([...images, result.assets[0]]);
  };

  const pickImageCam = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled) setImages([...images, result.assets[0]]);
  };

  const removePhoto = (uriFilter: any) => {
    setImages(images.filter((image) => image.uri !== uriFilter && image));
  };
  return (
    <>
      <Header title="Publicar scrap" rounded={false} />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ setFieldValue, handleSubmit, values }) => (
          <>
            <ScrollView>
              <View style={styles.content}>
                <Steps type={offer_type_id} step={3} />
                <Spacer size={10} />
                <SectionTitle
                  icon="image"
                  title="Fotos del material"
                  subtitle=""
                />
                <Spacer size={25} />
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  {images.map(({ uri }) => (
                    <>
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
                          <FontAwesome name="trash" size={18} color="#fff" />
                        </Pressable>
                        <Image
                          key={uri}
                          source={{ uri }}
                          style={{
                            width: (Layout.window.width - 10 * 8) / 2,
                            height: (Layout.window.width - 10 * 8) / 2,
                            marginBottom: 20,
                            marginRight: 20,
                            borderRadius: 10,
                          }}
                        />
                      </View>
                    </>
                  ))}
                </View>

                {!images.length ? (
                  <View style={{ alignItems: 'center' }}>
                    <FontAwesome
                      name="camera"
                      size={130}
                      style={{ marginVertical: 50 }}
                      color="#d1d1d1"
                    />
                  </View>
                ) : null}

                {images.length < 6 ? (
                  <View style={{ flexDirection: 'row', display: 'flex' }}>
                    <View style={{ marginRight: 10, flex: 1 }}>
                      <AddPicturePost label="Subir foto" onPress={pickImage} />
                    </View>
                    <View style={{ marginRight: 10, flex: 1 }}>
                      <AddPicturePost
                        label="Abrir camara"
                        onPress={pickImageCam}
                      />
                    </View>
                  </View>
                ) : null}
              </View>
            </ScrollView>
            <View
              style={[Platform.OS === 'ios' ? { paddingBottom: 20 } : null]}
            >
              <Button type="secondary" onPress={handleSubmit}>
                {!images.length ? 'Continuar sin foto' : 'Siguiente'}
              </Button>
            </View>
          </>
        )}
      </Formik>
    </>
  );
}

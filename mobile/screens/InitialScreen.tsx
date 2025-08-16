import * as React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Button from '../components/Button';
import Spacer from '../components/Spacer';
import Layout from '../constants/Layout';
import { RootStackScreenProps } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iosPadding: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  container0: {
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerFull: {
    flexDirection: 'column',
  },
  container2: {
    flex: 6,
  },
  buttons: {
    position: 'absolute',
    bottom: 20,
    width: Layout.window.width - Layout.baseMargin,
  },
  image: {
    height: 125,
    marginTop: 50,
    marginBottom: 25,
    resizeMode: 'contain',
  },
  slider: {},
});

const image1 = require('../assets/images/slider/slider1.jpeg');
const image2 = require('../assets/images/slider/slider2.jpeg');
const image3 = require('../assets/images/slider/slider3.jpeg');

const state = {
  images: Platform.OS === 'ios' ? [image1, image2] : [image1, image2, image3],
};
const isTablet = () => {
  const window = Dimensions.get('window');
  const minTabletWidth = 768;

  return window.width >= minTabletWidth;
};
export default function InitialScreen({
  navigation,
}: RootStackScreenProps<'Initial'>) {
  return (
    <>
      <View
        style={[
          styles.container0,
          Platform.OS === 'ios' ? styles.iosPadding : null,
        ]}
      >
        <Text style={{ fontSize: 25, fontWeight: '900', color: '#434343' }}>
          Reciclar nunca fue tan fácil
        </Text>
      </View>
      <View
        style={[
          styles.container2,
          Platform.OS === 'ios' ? styles.iosPadding : null,
        ]}
      >
        <Carousel
          width={Layout.window.width}
          height={
            Layout.window.width > 330
              ? Layout.window.width - 20
              : Layout.window.width / 1.4
          }
          data={state.images}
          renderItem={({ item }) => (
            <Image
              source={item}
              style={{
                width: Layout.window.width - 40,
                height:
                  Layout.window.width > 330
                    ? Layout.window.width - 20
                    : Layout.window.width / 1.4,
                resizeMode: 'contain',
                borderRadius: 10,
              }}
            />
          )}
          autoPlay={true}
          loop={true}
          scrollAnimationDuration={1000}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button
            type="secondary"
            onPress={() => navigation.navigate('SignUp')}
            style={{ fontWeight: '900', textTransform: 'uppercase' }}
          >
            Registrarme
          </Button>

          <Spacer size={15} />

          <Button type="normal" onPress={() => navigation.navigate('LogIn')}>
            Iniciar sesión
          </Button>

          <Spacer size={30} />

          {Platform.OS === 'ios' && isTablet() ? (
            <View
              style={{
                marginTop: 40,
              }}
            >
              <Button onPress={() => navigation.navigate('Root')}>
                Quiero probar Scrapy
              </Button>
            </View>
          ) : null}
        </View>
      </View>
    </>
  );
}

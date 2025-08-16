import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import get from 'lodash/get';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, {
  Callout,
  Circle,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { WebView } from 'react-native-webview';
import GeoIcon from '../assets/images/geolocalizacion.svg';
import sinFoto from '../assets/images/sin_foto.png';
import config from '../config/config';
import Layout from '../constants/Layout';
import Button from './Button';
import Title from './Title';

const Img = Image;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 250,
    width: 200,
  },
  containerTorky: {
    backgroundColor: 'white',
    height: 50,
  },
  pointerBlueCap: {
    backgroundColor: '#4185f454',
    width: 25,
    height: 25,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    bottom: 0,
    elevation: 100000,
    position: 'relative',
  },
  markerMyLocation: {
    elevation: 100000,
  },
  marker2: {
    bottom: 0,
    right: 0,
    resizeMode: 'contain',
    width: 25,

    height: 25,
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    position: 'relative',
    elevation: 100000,
  },
  marker: {
    width: 40,
    height: 40,
  },
  pointerBlue: {
    backgroundColor: '#4185f4',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 100000,
    width: 16,
    height: 16,
    position: 'relative',
    borderRadius: 100,
    bottom: 0,
  },
  picture: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  sinFoto: {},
  containerImg: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-start',
    alignContent: 'center',
    resizeMode: 'cover',
  },
});

type MapsProps = {
  filters: object;
  pages: string;
  locationRetrive: any;
  location: any;
  onLocationSet: any;
  userData: string;
  torky: boolean;
};

function Maps({
  userData,
  location,
  onLocationSet,
  filters,
  pages,
  torky,
}: MapsProps) {
  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigation();

  const maps = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (
      status === 'granted' &&
      location.coords.latitude === config.LAT &&
      location.coords.longitude === config.LONG
    ) {
      const locationSave: any = await Location.getCurrentPositionAsync({});
      if (onLocationSet) {
        onLocationSet(locationSave);
      }
    }
  };
  maps();
  const imageHtml = `<div style="width:800px;text-align:center;display:block;background:#eee;"><img src="https://api.scrapyapp.com/sin_foto.png" height="400px" width="700px" style="object-fit:cover;margin:0 auto" /></div>`;

  return (
    <>
      <MapView
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={[
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#49DA8B',
              },
              {
                lightness: 17,
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#dbfff0',
              },
              {
                lightness: 29,
              },
              {
                weight: 0.2,
              },
            ],
          },
        ]}
        style={{
          width: Layout.window.width,
          height: Layout.window.height - 139,
          left: -20,
        }}
      >
        {location.show && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            style={styles.markerMyLocation}
          >
            <View style={styles.pointerBlueCap}>
              <View style={styles.pointerBlue} />
            </View>
          </Marker>
        )}

        <Circle
          center={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          radius={filters.range * 1000}
          strokeColor="#49DA8B"
          fillColor="#49DA8B33"
        />

        {pages.map((page) =>
          get(page, 'data[0].data', [])
            .filter(
              (o) =>
                o?.address?.latitude != 'undefined' &&
                o?.address?.longitude != 'undefined'
            )
            .map((offer) => (
              <Marker
                key={offer.id}
                coordinate={{
                  latitude: parseFloat(offer?.address?.latitude ?? 0),
                  longitude: parseFloat(offer?.address?.longitude ?? 0),
                }}
              >
                <GeoIcon />
                <Callout
                  onPress={() =>
                    navigation.navigate(
                      torky ? 'ViewOwnOfferTorky' : 'ViewOwnOffer',
                      offer
                    )
                  }
                >
                  <View
                    style={
                      torky
                        ? {
                            width: 150,
                            height: 48,
                          }
                        : styles.container
                    }
                  >
                    {!torky && (
                      <>
                        <View style={styles.containerImg}>
                          {Platform.OS === 'android' ? (
                            offer?.images?.length > 0 ? (
                              <WebView
                                source={{
                                  html: `<div style="width:800px;text-align:center;display:block;background:#eee;"><img src="${
                                    config.STORAGE_PATH + offer.images[0].path
                                  }" height="400px" width="700px" style="object-fit:cover;margin:0 auto" /></div>`,
                                }}
                              />
                            ) : (
                              <WebView source={{ html: imageHtml }} />
                            )
                          ) : // IOS
                          offer?.images?.length > 0 ? (
                            <Image
                              source={{
                                uri: config.STORAGE_PATH + offer.images[0].path,
                              }}
                              style={styles.sinFoto}
                            />
                          ) : (
                            <Image source={sinFoto} style={styles.sinFoto} />
                          )}
                        </View>
                        <Title>{offer?.title}</Title>
                        <Text>{offer?.description}</Text>
                        {offer?.value_with_shipping ? (
                          <Text>
                            Valor por {offer?.measure_type?.name} con retiro:{' '}
                            {offer?.value_with_shipping}
                          </Text>
                        ) : null}
                        {offer?.value_without_shipping ? (
                          <Text>
                            Valor por {offer?.measure_type?.name} sin retiro:{' '}
                            {offer?.value_without_shipping}
                          </Text>
                        ) : null}
                      </>
                    )}

                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        marginHorizontal: 'auto',
                      }}
                    >
                      <Button type="primary">Ver</Button>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))
        )}
      </MapView>
    </>
  );
}

Maps.defaultProps = {};

export default Maps;

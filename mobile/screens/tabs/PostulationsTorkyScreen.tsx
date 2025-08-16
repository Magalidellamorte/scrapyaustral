import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { get } from 'lodash';
import moment from 'moment';
import * as React from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import GeoIcon from '../../assets/images/geolocalizacion.svg';
import Header from '../../components/Header';
import { Text, View } from '../../components/Themed';
import Layout from '../../constants/Layout';
import { useOwnPickupOffers } from '../../services/useOwnOffers';

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  tab: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#444',
  },
  activeTabText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 130,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  noOffers: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  filtersContainer: {
    position: 'absolute',
    right: 20,
    top: 5,
  },
  markerMyLocation: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#49DA8B',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointerBlueCap: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointerBlue: {
    width: 4,
    height: 4,
    backgroundColor: '#49DA8B',
    borderRadius: 2,
  },
  sinFoto: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});

export default function OffersScreen() {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = React.useState('Lista');
  const offers = useOwnPickupOffers(activeTab === 'Histórico' ? true : false);
  const offersData = get(offers, 'data.data', []).offers;

  const [location, setLocation] = React.useState({
    coords: { latitude: -34.3458712, longitude: -58.7884532 },
  });

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso para acceder a la ubicación denegado');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        coords: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      });
    })();
  }, []);

  React.useEffect(() => {
    onRefresh();
  }, [activeTab]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      onRefresh();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    offers.refetch();
  };

  return (
    <>
      <Header rounded={false} />

      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('Lista')}
            style={styles.tab}
          >
            <Text
              style={
                activeTab === 'Lista' ? styles.activeTabText : styles.tabText
              }
            >
              Lista
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('Mapa')}
            style={styles.tab}
          >
            <Text
              style={
                activeTab === 'Mapa' ? styles.activeTabText : styles.tabText
              }
            >
              Mapa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('Histórico')}
            style={styles.tab}
          >
            <Text
              style={
                activeTab === 'Histórico'
                  ? styles.activeTabText
                  : styles.tabText
              }
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        {activeTab === 'Lista' && (
          <View style={{ paddingTop: 10 }}>
            <ScrollView
              style={{ height: '100%' }}
              refreshControl={
                <RefreshControl
                  onRefresh={onRefresh}
                  refreshing={offers.isLoading || offers.isFetching}
                />
              }
            >
              {!offersData?.length ? (
                <Text style={styles.noOffers}>
                  No tenes postulaciones a retiro
                </Text>
              ) : (
                offersData.map((grouped) => (
                  <View key={grouped.date}>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                        {moment(grouped.date)
                          .format('dddd DD [de] MMMM YYYY')
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      </Text>
                    </View>
                    {grouped?.offers?.map((offer) => (
                      <Pressable
                        key={offer.id}
                        onPress={
                          () =>
                            navigation.navigate('ViewTorkyScreen', {
                              id: offer?.id,
                            })
                          // moment().isBetween(
                          //   offer.expected_start_pickup_at,
                          //   offer.expected_end_pickup_at
                          // ) ||
                          // (moment(offer.expected_start_pickup_at).isSame(
                          //   moment(),
                          //   'day'
                          // ) &&
                          //   !moment().isBefore(
                          //     moment(offer.expected_start_pickup_at).subtract(
                          //       1,
                          //       'hour'
                          //     )
                          //   ))
                          //   ? () =>
                          //       navigation.navigate('TorkyDetail', { offer })
                          //   : undefined
                        }
                      >
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: '#E8E8E8',
                            backgroundColor: 'white',
                            padding: 15,
                            borderRadius: 10,
                            marginBottom: 10,
                            shadowColor: '#000',
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                          }}
                        >
                          <View
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 8,
                              backgroundColor: moment().isBetween(
                                offer.expected_start_pickup_at,
                                offer.expected_end_pickup_at
                              )
                                ? '#4CD964'
                                : moment().isBefore(
                                    moment(
                                      offer.expected_start_pickup_at
                                    ).subtract(1, 'hour')
                                  )
                                ? '#FF0000'
                                : moment(offer.expected_start_pickup_at).isSame(
                                    moment(),
                                    'day'
                                  )
                                ? '#FFA500'
                                : '#808080',
                              borderTopLeftRadius: 10,
                              borderBottomLeftRadius: 10,
                            }}
                          />
                          <View
                            style={{
                              marginLeft: 5,
                              backgroundColor: 'transparent',
                            }}
                          >
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                              {offer.offer.title}
                            </Text>
                            <Text style={{ fontSize: 14, fontStyle: 'italic' }}>
                              {offer.offer.address.readable}
                            </Text>
                            <Text style={{ fontSize: 14, marginTop: 5 }}>
                              {offer.offer.user.full_name}
                            </Text>
                            <Text style={{ fontSize: 14, marginTop: 5 }}>
                              <FontAwesome
                                name="clock-o"
                                size={16}
                                color="#444"
                                style={{ marginEnd: 5 }}
                              />
                              {` `}
                              {offer.offer.torky_pickup_range}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        )}
        {activeTab === 'Histórico' && (
          <View style={{ paddingTop: 10 }}>
            <ScrollView
              style={{ height: '100%' }}
              refreshControl={
                <RefreshControl
                  onRefresh={onRefresh}
                  refreshing={offers.isLoading || offers.isFetching}
                />
              }
            >
              {!offersData?.length ? (
                <Text style={styles.noOffers}>
                  No tenes historial de retiros
                </Text>
              ) : (
                offersData.map((grouped) => (
                  <View key={grouped.date}>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                        {moment(grouped.date)
                          .format('dddd DD [de] MMMM YYYY')
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      </Text>
                    </View>
                    {grouped?.offers?.map((offer) => (
                      <Pressable
                        key={offer.id}
                        onPress={() =>
                          navigation.navigate('ViewTorkyScreen', {
                            id: offer?.id,
                          })
                        }
                      >
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: '#E8E8E8',
                            padding: 15,
                            borderRadius: 10,
                            marginBottom: 10,
                            backgroundColor: '#90EE90',
                            shadowColor: '#000',
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                          }}
                        >
                          <View
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 8,
                              backgroundColor: '#4CD964',
                              borderTopLeftRadius: 10,
                              borderBottomLeftRadius: 10,
                            }}
                          />
                          <View
                            style={{
                              marginLeft: 5,
                              backgroundColor: 'transparent',
                            }}
                          >
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                              {offer.offer.title}
                            </Text>
                            <Text style={{ fontSize: 14, fontStyle: 'italic' }}>
                              {
                                offer.offer.address.readable_public.split(
                                  ','
                                )[0]
                              }
                            </Text>
                            <Text style={{ fontSize: 14, marginTop: 5 }}>
                              {offer.offer.user.full_name}
                            </Text>
                            <Text style={{ fontSize: 14, marginTop: 5 }}>
                              <FontAwesome
                                name="clock-o"
                                size={16}
                                color="#444"
                                style={{ marginEnd: 5 }}
                              />
                              {` `}
                              {offer.offer.torky_pickup_range}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        )}
        {activeTab === 'Mapa' && (
          <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
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
            {offersData?.map((grouped) =>
              grouped?.offers?.map((offer) => {
                const latitude = parseFloat(
                  offer?.offer?.address?.latitude ?? 0
                );
                const longitude = parseFloat(
                  offer?.offer?.address?.longitude ?? 0
                );
                if (!latitude || !longitude) return null;

                return (
                  <Marker
                    key={offer.id}
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                  >
                    <GeoIcon />
                    <Callout
                      tooltip
                      onPress={() =>
                        navigation.navigate('ViewTorkyScreen', {
                          id: offer?.id,
                        })
                      }
                    >
                      <View
                        style={{
                          backgroundColor: '#fff',
                          borderRadius: 10,
                          padding: 15,
                          width: 250,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                          {offer?.offer?.address?.readable_public}
                        </Text>
                        <Text style={{ fontSize: 12, marginTop: 5 }}>
                          {offer?.offer?.user?.full_name}
                        </Text>
                        <Text style={{ fontSize: 12, marginTop: 5 }}>
                          <FontAwesome
                            name="clock-o"
                            size={12}
                            color="#444"
                            style={{ marginEnd: 5 }}
                          />
                          {` `}
                          {offer?.offer?.torky_pickup_range}
                        </Text>
                      </View>
                    </Callout>
                  </Marker>
                );
              })
            )}
          </MapView>
        )}
      </View>
    </>
  );
}

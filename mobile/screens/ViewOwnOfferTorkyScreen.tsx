import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import moment from 'moment';
import * as React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from 'react-query';
import Button from '../components/Button';
import CategoryImage from '../components/CategoryImage';
import Divider from '../components/Divider';
import Header from '../components/Header';
import SectionTitle from '../components/SectionTitle';
import Spacer from '../components/Spacer';
import config from '../config/config';
import Layout from '../constants/Layout';
import { useGlobalState } from '../context/GlobalStateContext';
import useOffer from '../services/useOffer';
import useUser from '../services/useUser';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },

  imageSize: {
    width: 50,
    height: 50,
  },
  content: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  subtitle2: {
    fontSize: 16,
    marginLeft: 15,
    color: '#757575',
    width: '80%',
  },
  typeDonation: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#dbfff0',
    color: '#047e4b',
  },
  typeSell: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#49DA8B',
    color: 'white',
  },
  type: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    width: 120,
    textAlign: 'center',
  },
  picture: {
    width: Layout.window.width,
    height: 250,
    resizeMode: 'cover',
  },
  centered: {
    fontSize: 18,
    textAlign: 'center',
  },
  category: {
    textTransform: 'uppercase',
    fontSize: 10,
    color: '#858585',
    marginBottom: 10,
  },
  contentContainer: {
    padding: 25,
    paddingBottom: 10,
  },
  titleSection: {
    fontSize: 20,
  },
});

export default function ViewOwnOfferScreen({ navigation, route }) {
  const { data: loggedUser } = useUser();
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const offerCall = useOffer(route.params.id);
  const offer = offerCall?.data?.data;
  const title = offer?.title;
  const description = offer?.description;

  const onRefresh = () => {
    offerCall.refetch();
  };

  const isOwnOffer =
    offer?.user?.id && offer?.user?.id === loggedUser?.data?.id;

  const renderCarouselitem = ({ item: image }) => (
    <Image
      source={{ uri: `${config.STORAGE_PATH}${image.path}` }}
      style={styles.picture}
    />
  );
  const queryClient = useQueryClient();

  const {
    isLoading: isDeleting,
    isError: isDeleteError,
    error: deleteError,
    mutate: deleteMutate,
  } = useMutation(
    'deleteOffer',
    (offerId) => {
      return axios.delete(`${config.BASE_ENDPOINT}/offers.torky/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('deleteOffer');

        Toast.show({
          type: 'success',
          text1: '¡Publicación eliminada!',
          position: 'bottom',
          visibilityTime: 500,
        });

        navigation.goBack();
      },
    }
  );

  const {
    isLoading: isPickingUp,
    isError: isPickupError,
    error: pickupError,
    mutate: pickupMutate,
  } = useMutation(
    'pickupOffer',
    (offerId) => {
      return axios.post(
        `${config.BASE_ENDPOINT}/offers.torky/${offerId}/pickup`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('pickupOffer');

        Toast.show({
          type: 'success',
          text1: '¡Bien! Se registro el retiro',
          position: 'bottom',
          visibilityTime: 500,
        });
        offerCall.refetch();
      },
    }
  );

  return (
    <>
      <Header rounded={false} />

      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={offerCall.isLoading}
          />
        }
      >
        <View style={styles.content}>
          <Carousel
            data={offer?.images ?? []}
            renderItem={renderCarouselitem}
            width={width}
            height={250}
          />

          <View style={styles.contentContainer}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {offer?.offer_categories?.length > 0
                ? offer.offer_categories.map((category: string) => (
                    <View
                      key={category.id}
                      style={{
                        alignItems: 'center',
                        marginRight: 20,
                      }}
                    >
                      <CategoryImage
                        value={category.id}
                        style={{ width: 50, height: 50 }}
                      />
                      <Text style={[styles.category, { marginTop: 5 }]}>
                        {category.name}
                      </Text>
                    </View>
                  ))
                : null}
            </View>
            <Text style={{ fontSize: 10, color: '#858585' }}>#{offer?.id}</Text>
            {/* <Text style={styles.title}>{title}</Text> */}
            {/* <Text>{description}</Text> */}

            {/* <Divider color="#D3D3D333" height={20} /> */}

            <Text style={styles.titleSection}>Día y Horario pretendido</Text>

            <Spacer size={20} />
            {offer?.torky_pickup_at ? (
              <Text>
                <FontAwesome name="calendar" size={12} color="#858585" />
                {` `}
                {moment(offer.torky_pickup_at).format('DD/MM/YYYY')}
              </Text>
            ) : null}
            <Spacer size={3} />
            {offer?.torky_pickup_range ? (
              <>
                <Text>
                  <FontAwesome name="clock-o" size={12} color="#858585" />
                  {` `}
                  {offer.torky_pickup_range}
                </Text>
              </>
            ) : null}

            {isOwnOffer && (
              <>
                <Divider color="#D3D3D333" height={20} />
                <Text style={styles.titleSection}>Recicladora asignada</Text>
                {offer?.torkies?.length > 0 ? (
                  <>
                    <Text
                      style={{
                        color: 'grey',
                        fontStyle: 'italic',
                      }}
                    >
                      Ya tenes un Torky asignado!
                    </Text>
                    <Spacer size={20} />

                    <Pressable
                      onPress={() => {
                        navigation.navigate('ViewTorkyScreen', {
                          id: offer?.torkies[0].id,
                        });
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: '#fff',
                          borderRadius: 10,
                          paddingTop: 15,
                          paddingBottom: 5,
                          borderWidth: 1,
                          borderColor: '#49DA8B',
                        }}
                      >
                        <View
                          style={{ paddingHorizontal: 15, paddingBottom: 15 }}
                        >
                          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                            {offer?.torkies[0]?.user?.full_name}
                          </Text>
                          <Spacer size={5} />

                          {offer?.torkies[0]?.pickup_at ? (
                            <>
                              <Text>
                                Ya se retiró el material, gracias por su
                                colaboración!
                              </Text>
                            </>
                          ) : offer?.torkies[0].started_at ? (
                            <>
                              <Text>
                                El Torky ya está en camino, pronto va a estar
                                por tu dirección.
                              </Text>
                            </>
                          ) : (
                            <>
                              <Text>
                                El Torky va a estar por tu dirección el día y
                                horario:
                              </Text>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginTop: 10,
                                }}
                              >
                                <FontAwesome
                                  name="calendar"
                                  size={12}
                                  color="#858585"
                                />
                                <Text style={{ marginLeft: 5 }}>
                                  {new Date(
                                    offer?.torkies[0]?.expected_start_pickup_at
                                  ).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginTop: 5,
                                }}
                              >
                                <FontAwesome
                                  name="clock-o"
                                  size={12}
                                  color="#858585"
                                />
                                <Text style={{ marginLeft: 5 }}>
                                  {new Date(
                                    offer?.torkies[0]?.expected_start_pickup_at
                                  ).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}{' '}
                                  a{' '}
                                  {new Date(
                                    offer?.torkies[0]?.expected_end_pickup_at
                                  ).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </Text>
                              </View>
                            </>
                          )}
                        </View>
                        <View
                          style={{
                            borderTopWidth: 0.5,
                            borderTopColor: '#aaa',
                            paddingTop: 5,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 12,
                            }}
                          >
                            Ver más detalles
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Spacer size={20} />
                    <Text>Sin postulación</Text>
                  </>
                )}
              </>
            )}

            <Divider color="#D3D3D333" height={20} />
            <View>
              <SectionTitle
                icon="map-marker"
                title="Ubicación"
                subtitle={offer?.address?.readable}
              />
              <Spacer />
              {offer?.address?.latitude !== 'undefined' &&
              offer?.address?.longitude !== 'undefined' ? (
                <>
                  <MapView
                    provider={
                      Platform.OS === 'android'
                        ? PROVIDER_GOOGLE
                        : PROVIDER_DEFAULT
                    }
                    style={{
                      width: Layout.window.width,
                      height: 200,
                      left: -25,
                    }}
                    region={{
                      latitude: parseFloat(offer?.address?.latitude ?? 0),
                      longitude: parseFloat(offer?.address?.longitude ?? 0),
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.015,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: parseFloat(offer?.address?.latitude ?? 0),
                        longitude: parseFloat(offer?.address?.longitude ?? 0),
                      }}
                    />
                  </MapView>
                </>
              ) : null}
              <Spacer />
              {isOwnOffer ? (
                offer?.torkies[0]?.pickup_at ? (
                  <></>
                ) : (
                  <Button
                    type="dangerLight"
                    onPress={() => deleteMutate(route.params.id)}
                  >
                    Eliminar publicación
                  </Button>
                )
              ) : offer?.torkies?.length > 0 ? (
                <Button type="grey" onPress={() => {}}>
                  Pendiente
                </Button>
              ) : (
                <Button
                  type="secondary"
                  onPress={() => pickupMutate(route.params.id)}
                >
                  Retirar
                </Button>
              )}
              <Spacer />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

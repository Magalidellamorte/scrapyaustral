import { FontAwesome, FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Button from '../components/Button';
import Divider from '../components/Divider';
import Header from '../components/Header';
import ProfileLite from '../components/ProfileLite';
import SetRating from '../components/rating/SetRating';
import Spacer from '../components/Spacer';
import config from '../config/config';
import Layout from '../constants/Layout';
import { useGlobalState } from '../context/GlobalStateContext';
import { useRatingTorky } from '../services/useRatingSeller';
import useUser from '../services/useUser';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 10,
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
  viewContainer: {
    alignContent: 'center',
    alignItems: 'center',
    width: Layout.window.width,
    position: 'absolute',
    bottom: 40,
    zIndex: 0,
  },
  viewButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    elevation: 1,
    zIndex: 0,
    fontSize: 14,
  },

  shadowProp: {
    shadowColor: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    // android specific
    elevation: 5,
    // ios specific
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.5,
  },
});
export default function OfferListScreeen({ route }) {
  const { globalState } = useGlobalState();
  const { token } = globalState;
  const { data: user } = useUser();
  const { id } = route.params;
  const ratingSeller = useRatingTorky();
  const [message, setMessage] = React.useState('');
  const [alreadyCalificated, setAlreadyCalificated] = React.useState(false);
  const [currentRating, setCurrentRating] = React.useState(0);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [kg, setKg] = React.useState('');

  const {
    data: torky,
    isLoading,
    error,
    refetch: torkyRefetch,
  } = useQuery(['torky', id], () =>
    axios.get(`${config.BASE_ENDPOINT}/torkies/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
  const {
    isLoading: isDeleting,
    isError: isDeleteError,
    error: deleteError,
    mutate: startTorky,
  } = useMutation(
    'startTorky',
    (torkyId) => {
      return axios.post(
        `${config.BASE_ENDPOINT}/torkies/${torkyId}/start`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('startTorky');
        torkyRefetch();
        Toast.show({
          type: 'success',
          text1: '¡Viaje iniciado!',
          position: 'bottom',
          visibilityTime: 500,
        });
      },
    }
  );

  const {
    isLoading: isEnding,
    isError: isEndingError,
    error: endingError,
    mutate: endTorkyMutate,
  } = useMutation(
    'endTorky',
    (torkyId) => {
      console.log('torkyId', torkyId);
      console.log('kg', kg);
      return axios.post(
        `${config.BASE_ENDPOINT}/torkies/${torkyId}/end`,
        { kg },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('endTorky');
        torkyRefetch();
        Toast.show({
          type: 'success',
          text1: '¡Viaje finalizado!',
          position: 'bottom',
          visibilityTime: 500,
        });
      },
      onError: (error) => {
        console.log('error', error);
      },
    }
  );

  React.useEffect(() => {
    if (torky) {
      if (torky?.data?.pickup_at) {
        const checkCalification = torky?.data?.user?.rating_as_client.find(
          (rating) => {
            return (
              rating.user_id === torky?.data?.user_id &&
              rating.offer_id === torky?.data?.offer_id
            );
          }
        );
        setAlreadyCalificated(checkCalification ? true : false);
      }
    }
  }, [torky]);

  if (!torky) return <></>;

  const handleRatingSubmit = (torkyId) => {
    ratingSeller.mutate(
      { torkyId, rating: currentRating, message },
      {
        onSuccess: () => {
          setAlreadyCalificated(true);
          Toast.show({
            type: 'success',
            text1: '¡La calificación se ha enviado correctamente!',
            position: 'bottom',
            visibilityTime: 500,
          });
        },
        onError: (error) => {},
      }
    );
  };

  const TorkyStatusBlock = ({ icon, disabled, title, children }) => (
    <View
      style={[
        {
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'flex-start',
        },
      ]}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: disabled ? '#ccc' : '#49DA8B',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: 'white',
          justifyContent: 'center',
          marginRight: 15,
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
        <SimpleLineIcons name={icon} size={24} color="white" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 10,
          }}
        >
          {title}
        </Text>
        {children}
      </View>
    </View>
  );
  if (user?.data.type === 'torky') {
    return (
      <>
        <Header rounded={false} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.container}>
            <View style={styles.content}>
              {!torky?.data?.pickup_at && (
                <>
                  <Pressable
                    onPress={() => {
                      navigation.navigate('ChatInternal', {
                        toUser: torky?.data?.offer?.user,
                        offerId: torky?.data?.offer_id,
                        torkyId: torky?.data?.id,
                      });
                    }}
                  >
                    <View
                      style={[{ flexDirection: 'row', alignItems: 'center' }]}
                    >
                      <View
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 100,
                          backgroundColor: 'white',
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: '#444',
                          justifyContent: 'center',
                          marginRight: 15,
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
                        <SimpleLineIcons
                          name="bubble"
                          size={40}
                          color="#49DA8B"
                        />
                      </View>
                      <View style={{ flex: 1, padding: 20 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginBottom: 10,
                          }}
                        >
                          Puedes utilizar el chat para despejar dudas
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                  <Divider color="#444" height={1} />
                </>
              )}
              <TorkyStatusBlock
                disabled={false}
                icon="check"
                title="Detalle del retiro"
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {torky?.data?.offer?.title}
                </Text>
                <Spacer size={5} />
                <Text style={{ fontSize: 12 }}>
                  Fecha:{' '}
                  {torky?.data?.expected_start_pickup_at
                    ? new Date(torky.data.expected_start_pickup_at)
                        .toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        .split('/')
                        .join('/')
                    : ''}
                </Text>
                <Text style={{ fontSize: 12 }}>
                  Horario:{' '}
                  {new Date(
                    torky?.data?.expected_start_pickup_at
                  ).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  a{' '}
                  {new Date(
                    torky?.data?.expected_end_pickup_at
                  ).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Spacer size={20} />
                <ProfileLite user={torky?.data?.offer?.user} goToProfile />
              </TorkyStatusBlock>

              {!torky?.data?.pickup_at && (
                <>
                  <Spacer size={20} />
                  <Text style={{ fontSize: 14, textAlign: 'center' }}>
                    Cómo llegar al punto de recolección:
                  </Text>
                  <Text style={{ fontSize: 12, textAlign: 'center' }}>
                    {torky?.data?.offer?.address?.readable}
                  </Text>
                  <Spacer size={10} />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      flex: 1,
                      gap: 10,
                      width: '100%',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        const lat = torky?.data?.offer?.address?.latitude;
                        const lng = torky?.data?.offer?.address?.longitude;
                        const url = `waze://?ll=${lat},${lng}`;
                        Linking.canOpenURL(url).then((supported) => {
                          if (supported) {
                            Linking.openURL(url);
                          } else {
                            Linking.openURL(
                              `https://waze.com/ul?ll=${lat},${lng}`
                            );
                          }
                        });
                      }}
                      style={{
                        backgroundColor: '#09B6F6',
                        padding: 10,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                      }}
                    >
                      <FontAwesome5 name="waze" size={24} color="white" />
                      <Text style={{ color: 'white', marginLeft: 8 }}>
                        Waze
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        const lat = torky?.data?.offer?.address?.latitude;
                        const lng = torky?.data?.offer?.address?.longitude;
                        const url = Platform.select({
                          ios: `comgooglemaps://?q=${lat},${lng}`,
                          android: `google.navigation:q=${lat},${lng}`,
                        });
                        Linking.canOpenURL(url).then((supported) => {
                          if (supported) {
                            Linking.openURL(url);
                          } else {
                            Linking.openURL(
                              `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                            );
                          }
                        });
                      }}
                      style={{
                        backgroundColor: '#4285F4',
                        padding: 10,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                      }}
                    >
                      <FontAwesome name="map-marker" size={24} color="white" />
                      <Text style={{ color: 'white', marginLeft: 8 }}>
                        Google Maps
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <Spacer size={20} />

              <TorkyStatusBlock
                disabled={torky?.data?.started_at ? false : true}
                icon="refresh"
                title="En Ruta"
              >
                {torky?.data?.started_at && (
                  <>
                    <Text style={{ fontSize: 12 }}>
                      Inicio del viaje:{' '}
                      {torky?.data?.started_at
                        ? new Date(torky.data.started_at)
                            .toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            .split('/')
                            .join('/')
                        : ''}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      Horario:{' '}
                      {new Date(torky?.data?.started_at).toLocaleTimeString(
                        'es-ES',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </Text>
                    <Spacer size={5} />
                  </>
                )}

                {torky?.data?.started_at ? (
                  <Button type="grey">Iniciar viaje</Button>
                ) : (
                  <Button
                    type="secondary"
                    onPress={() => startTorky(torky?.data?.id)}
                  >
                    Iniciar viaje
                  </Button>
                )}
              </TorkyStatusBlock>

              <Spacer size={20} />
              <TorkyStatusBlock
                disabled={torky?.data?.pickup_at ? false : true}
                icon="flag"
                title="Viaje finalizado"
              >
                {torky?.data?.pickup_at && (
                  <>
                    <Text style={{ fontSize: 12 }}>
                      Fecha:{' '}
                      {torky?.data?.pickup_at
                        ? new Date(torky.data.pickup_at)
                            .toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            .split('/')
                            .join('/')
                        : ''}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      Horario:{' '}
                      {new Date(torky?.data?.pickup_at).toLocaleTimeString(
                        'es-ES',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </Text>
                    <Spacer size={5} />
                  </>
                )}
              </TorkyStatusBlock>

              <View
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                  },
                ]}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: 'white',
                    justifyContent: 'center',
                    marginRight: 15,
                    elevation: 5,
                  }}
                />
                <View style={{ flex: 1 }}>
                  {torky?.data?.pickup_at || !torky?.data?.started_at ? (
                    <Button type="grey">Finalizar viaje</Button>
                  ) : (
                    <>
                      <TextInput
                        style={{
                          backgroundColor: '#eee',
                          height: 40,
                          padding: 10,
                          marginBottom: 10,
                          borderRadius: 5,
                        }}
                        numberOfLines={5}
                        placeholder="Ingrese los KG"
                        keyboardType="numeric"
                        onChangeText={(value) => setKg(value)}
                        value={kg}
                      />
                      <Button
                        type="secondary"
                        onPress={() => endTorkyMutate(torky?.data?.id)}
                      >
                        Finalizar viaje
                      </Button>
                    </>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    );
  }

  if (user?.data.type === 'hogar') {
    return (
      <>
        <Header rounded={false} />
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            {!torky?.data?.pickup_at && (
              <>
                <Pressable
                  onPress={() => {
                    console.log('torky', {
                      toUser: torky?.data?.user,
                      offerId: torky?.data?.offer_id,
                      torkyId: torky?.data?.id,
                    });
                    navigation.navigate('ChatInternal', {
                      toUser: torky?.data?.user,
                      offerId: torky?.data?.offer_id,
                      torkyId: torky?.data?.id,
                    });
                  }}
                >
                  <View
                    style={[{ flexDirection: 'row', alignItems: 'center' }]}
                  >
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 100,
                        backgroundColor: 'white',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#444',
                        justifyContent: 'center',
                        marginRight: 15,
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
                      <SimpleLineIcons
                        name="bubble"
                        size={40}
                        color="#49DA8B"
                      />
                    </View>
                    <View style={{ flex: 1, padding: 20 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginBottom: 10,
                        }}
                      >
                        Puedes utilizar el chat para despejar dudas
                      </Text>
                    </View>
                  </View>
                </Pressable>
                <Divider color="#444" height={1} />
              </>
            )}
            <TorkyStatusBlock
              disabled={false}
              icon="check"
              title="Detalle del retiro"
            >
              <Text style={{ marginBottom: 5 }}>
                Fecha:{' '}
                {torky?.data?.expected_start_pickup_at
                  ? new Date(torky.data.expected_start_pickup_at)
                      .toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                      .split('/')
                      .join('/')
                  : ''}
              </Text>
              <Text>
                Horario:{' '}
                {new Date(
                  torky?.data?.expected_start_pickup_at
                ).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                a{' '}
                {new Date(
                  torky?.data?.expected_end_pickup_at
                ).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TorkyStatusBlock>

            <Spacer size={20} />

            <TorkyStatusBlock
              disabled={torky?.data?.started_at ? false : true}
              icon="refresh"
              title="Viaje en curso"
            >
              {torky?.data?.started_at && (
                <>
                  <Text style={{ marginBottom: 5 }}>
                    Inicio del viaje:{' '}
                    {torky?.data?.started_at
                      ? new Date(torky.data.started_at)
                          .toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                          .split('/')
                          .join('/')
                      : ''}
                  </Text>
                  <Text>
                    Horario:{' '}
                    {new Date(torky?.data?.started_at).toLocaleTimeString(
                      'es-ES',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </Text>
                </>
              )}
            </TorkyStatusBlock>

            <Spacer size={20} />

            <TorkyStatusBlock
              disabled={torky?.data?.pickup_at ? false : true}
              icon="flag"
              title="Viaje finalizado con éxito"
            >
              {torky?.data?.pickup_at && (
                <>
                  <Text style={{ marginBottom: 5 }}>
                    Fecha:{' '}
                    {torky?.data?.pickup_at
                      ? new Date(torky.data.pickup_at)
                          .toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                          .split('/')
                          .join('/')
                      : ''}
                  </Text>
                  <Text>
                    Horario:{' '}
                    {new Date(torky?.data?.pickup_at).toLocaleTimeString(
                      'es-ES',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </Text>
                </>
              )}
            </TorkyStatusBlock>

            {alreadyCalificated ? (
              <></>
            ) : (
              torky?.data?.pickup_at && (
                <>
                  <Spacer size={20} />
                  <Divider color="#444" height={1} />
                  <Spacer size={20} />
                  <View style={{ paddingHorizontal: 20 }}>
                    <Text
                      style={[{ fontStyle: 'italic', textAlign: 'center' }]}
                    >
                      Calificá a {torky?.data?.user?.full_name}
                    </Text>

                    <SetRating onFinishRating={setCurrentRating} />

                    <TextInput
                      multiline
                      style={{
                        backgroundColor: '#eee',
                        height: 70,
                        padding: 10,
                        textAlignVertical: 'top',
                      }}
                      numberOfLines={5}
                      onChangeText={(value) => setMessage(value)}
                      value={message}
                      placeholder="Deja un mensaje contando tu experiencia"
                    />
                    <View style={{ marginTop: 20 }}>
                      <Button
                        disabled={!currentRating}
                        onPress={() => handleRatingSubmit(torky?.data?.id)}
                        type="secondary"
                      >
                        Calificar
                      </Button>
                    </View>
                  </View>
                </>
              )
            )}
          </View>
        </ScrollView>
      </>
    );
  }
  return <></>;
}

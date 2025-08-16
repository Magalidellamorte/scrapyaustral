/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
import { Ionicons } from '@expo/vector-icons';
import get from 'lodash/get';
import moment from 'moment';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useQueryClient } from 'react-query';

import * as React from 'react';
import IconCajaBasura from '../assets/icons/offer/caja_basura.png';
import ConRetiro from '../assets/images/con-retiro.svg';
import SinRetiro from '../assets/images/sin-retiro.svg';
import BoldText from '../components/BoldText';
import Button from '../components/Button';
import ChatMessage from '../components/ChatMessage';
import ClosePostulation from '../components/ClosePostulation';
import Divider from '../components/Divider';
import HeaderChat from '../components/HeaderChat';
import PendingRating from '../components/PendingRating';
import Spacer from '../components/Spacer';
import Layout from '../constants/Layout';
import { useGlobalState } from '../context/GlobalStateContext';
import useOffer from '../services/useOffer';
import useRecievedMaterial from '../services/useRecievedMaterial';
import useUser from '../services/useUser';
import useWithdrawMaterial from '../services/useWithdrawMaterial';

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    backgroundColor: Platform.OS === 'ios' ? '#49DA8B' : 'white',
    alignItems: 'stretch',
  },
  scroll2: {
    overflow: 'scroll',
    top: 0,
  },
  scrollContainer: {
    height:
      Platform.OS === 'ios'
        ? Layout.window.height - 156
        : Layout.window.height - StatusBar.currentHeight,
  },
  content: {
    maxHeight: Layout.window.height - StatusBar.currentHeight - 56,
  },
  personInfo: {
    backgroundColor: '#90C4183D',
    borderRadius: 10,
  },
  personInfoText: {
    fontSize: 16,
    padding: 10,
  },
  viewProfileButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#90C4183D',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  viewProfileButtonText: {
    fontSize: 16,
    textAlign: 'right',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  chatMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: '#49DA8B',

    minHeight: 50,
    maxHeight: 100,
  },
  chatInputContainer: {
    flexGrow: 1,
  },
  icon: {
    position: 'absolute',
    right: 0,
  },
  textInput: {
    borderRadius: 10,
    padding: 5,
  },
  defailTitle: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  defailDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeContainer: {
    padding: 20,
  },
  baseInfo: {
    borderWidth: 2,
    borderRadius: 10,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeInputText: {
    fontSize: 16,
  },
  editButton: {
    textAlign: 'right',
    marginTop: 5,
    fontSize: 18,
  },
  boxChat: {
    padding: 10,
    width: '100%',
  },
});

export default function ChatInternalScreen({ navigation, route }) {
  const [scrollViewRef, setScrollViewRef] = React.useState(null);
  const isTorky = route.params.torkyId;
  const offerCall = useOffer(route.params.offerId);
  const postulations = get(offerCall, 'data.data.postulations', []);
  const queryClient = useQueryClient();

  const [tab, setTab] = React.useState('chat');
  const [message, setMessage] = React.useState('');
  const [messageList, setMessageList] = React.useState([]);

  const { globalState } = useGlobalState();
  const { socket } = globalState;

  const { data } = useUser();
  const user = get(data, 'data', {});

  const { toUser } = route.params;

  const offer = get(offerCall, 'data.data', {});

  const isOwnOffer = offer?.user?.id && offer?.user?.id === user?.id;

  const postulation = postulations.find((p) =>
    isOwnOffer ? p.user.id === toUser.id : p.user.id === user?.id
  );
  const startWithdrawal = useWithdrawMaterial();
  const recievedMaterial = useRecievedMaterial();
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    if (user.id && socket) {
      socket.emit('user-connected', {
        userId: user.id,
      });
    }
  }, [user.id, socket]);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setKeyboardVisible(true);

        setTimeout(() => {
          if (scrollViewRef) {
            scrollViewRef.scrollToEnd({ animated: true });
          }
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);

        setTimeout(() => {
          if (scrollViewRef) {
            scrollViewRef.scrollToEnd({ animated: true });
          }
        }, 100);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [scrollViewRef]);

  React.useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef) {
        scrollViewRef.scrollToEnd({ animated: true });
      }
    }, 100);
  }, [messageList, scrollViewRef]);

  const buttonsHandler = (type, postulationId, offerId) => {
    const query = type === 'recieved' ? recievedMaterial : startWithdrawal;

    query.mutate(postulationId, {
      onSuccess: () => {
        queryClient.invalidateQueries(['offer', offerId]);

        Toast.show({
          type: 'success',
          text1:
            type === 'recieved'
              ? '¡Has recibido el material!'
              : '¡Has comenzado el retiro!',
          position: 'bottom',
          visibilityTime: 500,
        });
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1:
            error?.response?.data?.message ??
            (type === 'recieved'
              ? 'Error al recibir el material'
              : 'Error al iniciar retiro'),
          position: 'bottom',
          visibilityTime: 1000,
        });
      },
    });
  };

  const changeTab = (tabName) => () => {
    setTab(tabName);
  };
  const sendMessage = () => {
    if (!message) return;

    try {
      console.log('Enviando mensaje:', {
        sender_id: user.id,
        receiver_id: toUser.id,
        offer_id: route.params.offerId,
        text: message,
      });

      socket.emit(
        'send-message',
        {
          sender_id: user.id,
          receiver_id: toUser.id,
          offer_id: route.params.offerId,
          text: message,
        },
        (error) => {
          if (error) {
            console.error('Error al enviar mensaje:', error);
            Toast.show({
              type: 'error',
              text1: 'Error al enviar el mensaje',
              position: 'bottom',
              visibilityTime: 1000,
            });
          } else {
            console.log('Mensaje enviado correctamente');
          }
        }
      );
    } catch (error) {
      console.error('Error al emitir evento:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al enviar el mensaje',
        position: 'bottom',
        visibilityTime: 1000,
      });
    }

    setMessage('');
  };

  React.useEffect(() => {
    socket.emit('initial-message-list', {
      sender_id: user.id,
      receiver_id: toUser.id,
      offer_id: route.params.offerId,
      user_id: user.id,
    });

    socket.on('initial-message-list', (initialMessages) => {
      setMessageList([...initialMessages]);

      queryClient.invalidateQueries(['chat_list', true]);
      queryClient.invalidateQueries(['chat_list', false]);

      if (scrollViewRef) {
        scrollViewRef.scrollToEnd({ animated: true });
      }
    });

    if (scrollViewRef) {
      scrollViewRef.scrollToEnd({ animated: true });
    }
    return () => {
      socket.off('initial-message-list');
    };
  }, []);

  React.useEffect(() => {
    socket.on('new-message', (newMessage) => {
      Platform.OS === 'android' && console.log('newMessage', newMessage);

      setMessageList((prevMessageList) => [...prevMessageList, newMessage]);

      if (scrollViewRef) {
        scrollViewRef.scrollToEnd({ animated: true });
      }
    });

    return () => {
      socket.off('new-message');
    };
  }, [scrollViewRef]);

  const pendingRating = offer?.pending_rating ?? [];

  const closeOfferComponents = (
    <>
      <View style={{ padding: 20 }}>
        {[1, 2, 4].includes(offer?.offer_status_id) ? (
          isOwnOffer &&
          (postulation?.value_without_shipping ||
            offer?.offer_types?.id != 1) ? (
            <>
              <Button
                type="primary"
                onPress={() => {
                  navigation.navigate('ViewPostulation', {
                    id: postulation.id,
                  });
                }}
              >
                Ampliar solicitud
              </Button>
              <Spacer />
              <Button
                type="secondary"
                onPress={() =>
                  buttonsHandler(
                    'recieved',
                    postulation.id,
                    postulation.offer_id
                  )
                }
                disabled={postulation?.offer_status_id == 3}
              >
                {postulation?.offer_status_id == 3
                  ? 'Material recibido'
                  : 'Concretar operación'}
              </Button>
              <Spacer />
              <Button
                type="dangerLight"
                onPress={() =>
                  navigation.navigate('ChatInternal', {
                    toUser: postulation.user_id,
                    offerId: postulation.offer_id,
                  })
                }
              >
                Eliminar ofertante
              </Button>
            </>
          ) : null
        ) : (
          <>
            <Divider color="#D3D3D333" height={20} />

            <View>
              <Text style={{ textAlign: 'center' }}>
                Anuncio {offer?.offer_status?.name}
              </Text>
            </View>

            <Spacer size={20} />

            {pendingRating.length && offer?.offer_status?.id !== 5 ? (
              <PendingRating rating={pendingRating[0]} />
            ) : null}
          </>
        )}
      </View>
    </>
  );

  const viewPostulationHandler = React.useCallback(() => {
    navigation.navigate('MakePostulation', {
      offerId: postulation?.offer_id,
    });
  }, [postulation?.offer_id]);

  return (
    <>
      <SafeAreaView style={styles.container} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <HeaderChat
          user={toUser}
          tabs={
            isTorky ? (
              <></>
            ) : (
              <>
                {tab === 'chat' ? (
                  !(
                    !isOwnOffer &&
                    (postulation?.offer_status_id === 3 ||
                      postulation?.offer_status_id === 4 ||
                      postulation?.offer_status_id === 5)
                  ) && (
                    <Pressable onPress={changeTab('details')}>
                      <Ionicons name="add" size={28} color="#fff" />
                    </Pressable>
                  )
                ) : (
                  <Pressable onPress={changeTab('chat')}>
                    <Ionicons name="ios-chatbubbles" size={28} color="#fff" />
                  </Pressable>
                )}
              </>
            )
          }
        />

        <View style={styles.content}>
          {tab === 'chat' ? (
            <>
              <View style={styles.scrollContainer}>
                <ScrollView
                  removeClippedSubviews={true}
                  keyboardShouldPersistTaps="handled"
                  ref={setScrollViewRef}
                  contentContainerStyle={[
                    styles.scroll2,
                    Platform.OS === 'android' && isKeyboardVisible
                      ? { paddingBottom: 400 }
                      : null,
                    Platform.OS === 'ios' && isKeyboardVisible
                      ? { paddingBottom: 340 }
                      : null,
                  ]}
                >
                  <View style={styles.boxChat}>
                    <View style={styles.personInfo}>
                      <Text style={styles.personInfoText}>
                        Estás hablando con {toUser.full_name}. Miembro de Scrapy
                        desde: {moment(toUser.created_at).format('DD/MM/YYYY')}
                      </Text>

                      <Pressable
                        onPress={() =>
                          navigation.navigate('PublicProfile', {
                            userId: toUser.id,
                          })
                        }
                      >
                        <View style={styles.viewProfileButton}>
                          <Text style={styles.viewProfileButtonText}>
                            Ver perfil
                            <Ionicons
                              name="chevron-forward"
                              size={16}
                              color="black"
                            />
                          </Text>
                        </View>
                      </Pressable>
                    </View>

                    {messageList.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                  </View>
                </ScrollView>
                {offer?.offer_status?.name === 'En curso' || isTorky ? (
                  <View
                    style={[
                      styles.chatMessageContainer,
                      isKeyboardVisible
                        ? {
                            position: 'absolute',
                            bottom: keyboardHeight - 42,
                            backgroundColor: 'white',
                            width: '100%',
                          }
                        : null,
                      Platform.select({
                        android: isKeyboardVisible
                          ? { marginBottom: 45 + 19 }
                          : { marginBottom: 22 },
                        ios: {},
                      }),
                    ]}
                  >
                    <View style={styles.chatInputContainer}>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => setMessage(text)}
                        value={message}
                        multiline
                        placeholder="Escribí un mensaje..."
                      />
                    </View>

                    <Pressable style={styles.icon} onPress={sendMessage}>
                      <Ionicons
                        name="chevron-forward-circle"
                        size={40}
                        color="#49DA8B"
                      />
                    </Pressable>
                  </View>
                ) : null}
              </View>
            </>
          ) : null}

          {tab === 'details' ? (
            <ScrollView>
              <View>
                {offer?.offer_types?.id === 1 ? (
                  <>
                    <Text style={styles.defailTitle}>RESUMEN</Text>

                    <Spacer />

                    <Text style={styles.defailDescription}>
                      En caso de editar el valor o fecha, debera ser aceptada
                      por el scraper. De lo contrario no tendra validez
                    </Text>

                    <Divider />

                    <Text style={styles.defailTitle}>Cotización pactada</Text>

                    {postulation?.value_without_shipping ? (
                      <>
                        <Spacer />

                        <View style={{ flexDirection: 'row' }}>
                          <ConRetiro width={60} height={60} />

                          <Spacer size={10} orientation="vertical" />

                          <View
                            style={[styles.baseInfo, { borderColor: 'green' }]}
                          >
                            <Text style={styles.fakeInputText}>
                              <BoldText>
                                {postulation?.value_with_shipping
                                  ? `$${postulation?.value_with_shipping}/${offer?.measure_type?.name}`
                                  : 'Sin oferta'}
                              </BoldText>{' '}
                              - Con retiro
                            </Text>
                          </View>
                        </View>
                      </>
                    ) : null}

                    {postulation?.value_without_shipping ? (
                      <>
                        <Spacer size={20} />

                        <View style={{ flexDirection: 'row' }}>
                          <SinRetiro width={60} height={60} />

                          <Spacer size="10" orientation="vertical" />

                          <View
                            style={[styles.baseInfo, { borderColor: 'red' }]}
                          >
                            <Text style={styles.fakeInputText}>
                              <BoldText>
                                {postulation?.value_without_shipping
                                  ? `$${postulation?.value_without_shipping}/${offer?.measure_type?.name}`
                                  : 'Sin oferta'}
                              </BoldText>{' '}
                              - Sin retiro
                            </Text>
                          </View>
                        </View>
                      </>
                    ) : null}

                    {!isOwnOffer ? (
                      <Pressable onPress={viewPostulationHandler}>
                        <Text style={styles.editButton}>Editar</Text>
                      </Pressable>
                    ) : null}

                    <Divider />

                    <Text style={styles.defailTitle}>Fecha pactada</Text>

                    <Spacer />

                    <Text style={styles.defailDescription}>
                      {postulation?.shipment_end_date &&
                      postulation?.shipment_start_date ? (
                        <>
                          <Spacer size={10} />
                          <Text style={[styles.text]}>
                            Entre{' '}
                            {moment(postulation?.shipment_start_date).format(
                              'dddd D [de] MMMM'
                            )}{' '}
                            y{' '}
                            {moment(postulation?.shipment_end_date).format(
                              'dddd D [de] MMMM'
                            )}
                          </Text>
                        </>
                      ) : null}
                    </Text>

                    {!isOwnOffer ? (
                      <Pressable onPress={viewPostulationHandler}>
                        <Text style={styles.editButton}>Editar</Text>
                      </Pressable>
                    ) : null}

                    <Divider />
                  </>
                ) : null}

                {isOwnOffer ? (
                  closeOfferComponents
                ) : postulation?.offer_status_id === 3 ||
                  postulation?.offer_status_id === 5 ? (
                  <>
                    {pendingRating.length ? (
                      <PendingRating rating={pendingRating[0]} />
                    ) : (
                      <View>
                        <Spacer size={30} />
                        <Text style={{ textAlign: 'center' }}>
                          Postulación finalizada
                        </Text>
                        <Spacer size={30} />
                        <Image
                          style={{
                            height: 200,
                            marginBottom: -60,
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                          source={IconCajaBasura}
                        />
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    {/* {postulation?.value_with_shipping ||
                  offer?.offer_types?.id != 1 ? (
                   <Button
                      type="primary"
                      onPress={() =>
                        buttonsHandler(
                          'withdrawal',
                          postulation.id,
                          postulation.offer_id
                        )
                      }
                      disabled={
                        postulation?.offer_status_id == 6 ||
                        postulation?.offer_status_id == 3
                      }
                    >
                      {postulation?.offer_status_id == 6
                        ? 'Retiro en curso'
                        : 'Comenzar retiro'}
                    </Button>
                  ) : null} */}
                    <View style={{ padding: 10 }}>
                      {isOwnOffer &&
                      (postulation?.value_without_shipping ||
                        offer?.offer_types?.id != 1) ? (
                        <>
                          <Spacer />

                          <Button
                            type="primary"
                            onPress={() =>
                              buttonsHandler(
                                'recieved',
                                postulation.id,
                                postulation.offer_id
                              )
                            }
                            disabled={postulation?.offer_status_id == 3}
                          >
                            {postulation?.offer_status_id == 3
                              ? 'Material recibido'
                              : 'Operación concretada'}
                          </Button>
                        </>
                      ) : null}

                      <Spacer />

                      <View style={{ marginBottom: 10 }}>
                        <Button
                          type="primary"
                          onPress={() => {
                            navigation.navigate('MakePostulation', {
                              offerId: postulation?.offer_id,
                            });
                          }}
                        >
                          Ver mi oferta
                        </Button>
                      </View>
                      <ClosePostulation
                        postulationId={postulation?.id}
                        offerId={postulation?.offer_id}
                      />
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
          ) : null}

          {/* {!isOwnOffer ? (
          <Text>
            //PONER CALIFICACIÓN- SOLO CUANDO LA OFERTA ESTE FINALIZADA
          </Text>
        ) : null} */}

          {tab === 'actions' ? <Text>Actions</Text> : null}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

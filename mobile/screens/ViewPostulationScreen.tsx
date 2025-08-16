import * as React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Formik } from 'formik';
import { get } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import Toast from 'react-native-toast-message';
import { useQueryClient } from 'react-query';

import Button from '../components/Button';
import Header from '../components/Header';
import Spacer from '../components/Spacer';
import usePostulation from '../services/usePostulation';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Divider from '../components/Divider';
import InputOffer from '../components/fields/InputOffer';
import TitleOffer from '../components/TitleOffer';
import useToggle from '../hooks/useToggle';
import useAcceptPostulation from '../services/useAcceptPostulation';
import useOffer from '../services/useOffer';
import useRejectPostulation from '../services/useRejectPostulation';

const styles = StyleSheet.create({
  subtitle2: {
    fontSize: 16,
    marginLeft: 15,
    color: '#757575',
    width: '80%',
  },
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
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
  postulationResult: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
});

export default function ViewPostulationScreen({ navigation, route }) {
  function TextEnvioDonante() {
    return <Text style={styles.subtitle2}>Envío a cargo del donante</Text>;
  }
  const [showSummary, setShowSummary] = useToggle();

  const { data } = usePostulation(route.params.id);
  const postulation = data?.data;

  const offerCall = useOffer(postulation?.offer_id);
  const offer = get(offerCall, 'data.data', {});

  const acceptPostulation = useAcceptPostulation();
  const rejectPostulation = useRejectPostulation();
  const queryClient = useQueryClient();

  const acceptPostulationHandler = (type, postulationId, offerId) => {
    const query = type === 'accept' ? acceptPostulation : rejectPostulation;

    query.mutate(postulationId, {
      onSuccess: () => {
        queryClient.invalidateQueries(['offer', offerId]);
        queryClient.invalidateQueries(['postulation', postulationId]);

        Toast.show({
          type: 'success',
          text1:
            type === 'accept'
              ? '¡Has aceptado la oferta!'
              : '¡Has rechazado la oferta!',
          position: 'bottom',
          visibilityTime: 500,
        });

        setShowSummary();
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1:
            error?.response?.data?.message ??
            (type === 'accept'
              ? 'Error al aceptar la oferta'
              : 'Error al rechazar la oferta'),
          position: 'bottom',
          visibilityTime: 1000,
        });
      },
    });
  };

  if (showSummary || route.params.showSummary) {
    return (
      <>
        <Header rounded={false} />

        <ScrollView>
          <View style={styles.content}>
            <Text
              style={[styles.text, { textAlign: 'center', fontWeight: '900' }]}
            >
              RESUMEN
            </Text>

            <Divider />

            <Spacer size={10} />

            <Text style={[styles.text, { textAlign: 'left' }]}>
              {offer?.offer_type_id === 1
                ? 'Cotización pactada'
                : 'Detalle de la oferta'}
            </Text>

            <Spacer size={20} />
            <Formik>
              {({ values, handleSubmit }) => (
                <>
                  {offer?.offer_type_id === 1 ? (
                    <>
                      <View>
                        <TitleOffer>Retira comprador</TitleOffer>
                        <InputOffer
                          color="#90C418"
                          offer={offer}
                          value={postulation?.value_with_shipping}
                          disabled
                          onGet={null}
                          onSet={null}
                          name="value_with_shipping"
                        />
                      </View>

                      <View>
                        <TitleOffer>Envia Vendedor</TitleOffer>
                        <InputOffer
                          color="#90C418"
                          value={postulation?.value_without_shipping}
                          disabled
                          offer={offer}
                          onGet={null}
                          onSet={null}
                          name="value_without_shipping"
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <BouncyCheckbox
                        size={25}
                        style={{ marginTop: 30 }}
                        fillColor="#49DA8B"
                        disableBuiltInState
                        unfillColor="#FFFFFF"
                        isChecked={
                          values?.value_with_shipping == 1 ? true : false
                        }
                        textComponent={
                          <Text style={styles.subtitle2}>
                            Retiro a cargo del interesado
                          </Text>
                        }
                        iconStyle={{ borderColor: '#49DA8B' }}
                        textStyle={{
                          textDecorationLine: 'none',
                        }}
                      />

                      <Spacer size={30} />

                      <BouncyCheckbox
                        style={{ marginTop: 10 }}
                        size={25}
                        fillColor="#49DA8B"
                        unfillColor="#FFFFFF"
                        disableBuiltInState
                        isChecked={
                          values?.value_without_shipping == 1 ? true : false
                        }
                        textComponent={<TextEnvioDonante />}
                        iconStyle={{ borderColor: '#49DA8B' }}
                        textStyle={{
                          textDecorationLine: 'none',
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </Formik>

            {/* 
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={ShippingOk}
                style={{ resizeMode: 'contain', width: 40, height: 40 }}
              />

              <Spacer size={10} orientation="vertical" />

              <View style={[styles.baseInfo, { borderColor: 'green' }]}>
                <Text style={styles.fakeInputText}>
                  <BoldText>
                    {postulation?.value_with_shipping
                      ? `$${postulation?.value_with_shipping}/${offer?.measure_type?.name}`
                      : 'Sin oferta'}
                  </BoldText>{' '}
                  - Con retiro
                </Text>
              </View>
            </View> */}

            {/* <Spacer size={20} /> */}
            {/* 
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={ShippingNot}
                style={{ resizeMode: 'contain', width: 40, height: 40 }}
              />

              <Spacer size={10} orientation="vertical" />

              <View style={[styles.baseInfo, { borderColor: 'red' }]}>
                <Text style={styles.fakeInputText}>
                  <BoldText>
                    {postulation?.value_without_shipping
                      ? `$${postulation?.value_without_shipping}/${offer?.measure_type?.name}`
                      : 'Sin oferta'}
                  </BoldText>{' '}
                  - Sin retiro
                </Text>
              </View>
            </View> */}

            <Divider />
            {/* 
            <Text style={[styles.text, { textAlign: 'center' }]}>
              Fecha pactada para la entrega
            </Text> */}

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
          </View>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <Header rounded={false} />

      <ScrollView>
        {/* <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#f7f7f7',
          }}
        >
          <View
            style={{
              margin: 20,
              height: 100,
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <ProfileLite user={postulation?.user} goToProfile />

            <Pressable
              onPress={() =>
                navigation.navigate('PublicProfile', {
                  userId: postulation?.user?.id,
                })
              }
            >
              <Text style={{ textDecorationLine: 'underline' }}>
                Ver perfíl
              </Text>
            </Pressable>
          </View>
        </View> */}

        <View style={styles.content}>
          {/* Cuando no acepto, esta en estado pendiente */}
          {postulation?.offer_status_id === 1 ? (
            <>
              <Text style={[styles.text, { fontStyle: 'italic' }]}>
                Al aceptar la oferta podrás comenzar a chatear con el{' '}
                {offer?.offer_type_id === 1 ? 'comprador' : 'donador'}.
              </Text>
            </>
          ) : null}

          {/* Cuando acepto, esta en estado en curso */}
          {postulation?.offer_status_id === 1 ||
          postulation?.offer_status_id === 2 ? (
            <>
              <Text style={{ marginTop: 10 }}>
                Recordá que la publicación se mantendrá vigente hasta que
                indiques a la plataforma que la operación se ha concretado ó
                cancelado.
              </Text>
            </>
          ) : null}

          <Spacer size={50} />

          <Text style={[styles.text]}>Detalle de la oferta</Text>
          <View>
            <Formik>
              {({ values, handleSubmit }) => (
                <>
                  {offer?.offer_type_id === 1 ? (
                    <>
                      <View>
                        <TitleOffer>Retira comprador</TitleOffer>
                        <InputOffer
                          color="#90C418"
                          offer={offer}
                          value={postulation?.value_with_shipping}
                          disabled
                          onGet={null}
                          onSet={null}
                          name="value_with_shipping"
                        />
                      </View>
                      <View>
                        <TitleOffer>Envia Vendedor</TitleOffer>
                        <InputOffer
                          color="#90C418"
                          value={postulation?.value_without_shipping}
                          disabled
                          offer={offer}
                          onGet={null}
                          onSet={null}
                          name="value_without_shipping"
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <BouncyCheckbox
                        size={25}
                        style={{ marginTop: 30 }}
                        fillColor="#49DA8B"
                        disableBuiltInState
                        unfillColor="#FFFFFF"
                        isChecked={
                          values?.value_with_shipping == 1 ? true : false
                        }
                        textComponent={
                          <Text style={styles.subtitle2}>
                            Retiro a cargo del interesado
                          </Text>
                        }
                        iconStyle={{ borderColor: '#49DA8B' }}
                        textStyle={{
                          textDecorationLine: 'none',
                        }}
                      />

                      <Spacer size={30} />

                      <BouncyCheckbox
                        style={{ marginTop: 10 }}
                        size={25}
                        fillColor="#49DA8B"
                        unfillColor="#FFFFFF"
                        disableBuiltInState
                        isChecked={
                          values?.value_without_shipping == 1 ? true : false
                        }
                        textComponent={<TextEnvioDonante />}
                        iconStyle={{ borderColor: '#49DA8B' }}
                        textStyle={{
                          textDecorationLine: 'none',
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </Formik>
          </View>

          {postulation?.shipment_end_date &&
          postulation?.shipment_start_date ? (
            <>
              <Spacer size={10} />
              <Text style={[styles.text, { textAlign: 'right' }]}>
                Entre{' '}
                {moment(postulation?.shipment_start_date).format('DD/MM/YYYY')}{' '}
                y {moment(postulation?.shipment_end_date).format('DD/MM/YYYY')}
              </Text>
            </>
          ) : null}

          <Spacer size={50} />

          {postulation?.offer_status_id === 5 ? (
            <Text style={styles.postulationResult}>Oferta cancelada</Text>
          ) : null}
          {postulation?.offer_status_id === 4 ? (
            <Text style={styles.postulationResult}>Oferta rechazada</Text>
          ) : null}
          {postulation?.offer_status_id === 3 ? (
            <Text style={styles.postulationResult}>Oferta aceptada</Text>
          ) : null}

          {postulation?.offer_status_id === 1 ? (
            <>
              <Button
                type="secondary"
                onPress={() =>
                  acceptPostulationHandler(
                    'accept',
                    postulation?.id,
                    postulation?.offer_id
                  )
                }
                disabled={acceptPostulation.isLoading}
              >
                Aceptar solicitud
              </Button>

              <Spacer />

              <Button
                type="dangerLight"
                onPress={() =>
                  acceptPostulationHandler(
                    'reject',
                    postulation?.id,
                    postulation?.offer_id
                  )
                }
                disabled={rejectPostulation.isLoading}
              >
                Rechazar solicitud
              </Button>
            </>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}

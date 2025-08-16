import { Formik } from 'formik';
import * as React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useQueryClient } from 'react-query';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import IconCajaBasura from '../assets/icons/offer/caja_basura.png';
import IconMostrandoCelular from '../assets/icons/offer/mostrando_celular.png';
import BoldText from '../components/BoldText';
import Button from '../components/Button';
import Filters from '../components/Filters';
import FooterOffer from '../components/FooterOffer';
import Header from '../components/Header';
import PendingRating from '../components/PendingRating';
import Spacer from '../components/Spacer';
import TitleOffer from '../components/TitleOffer';
import InputOffer from '../components/fields/InputOffer';
import SetRating from '../components/rating/SetRating';
import Layout from '../constants/Layout';
import useMakePostulation from '../services/useMakePostulation';
import useOffer from '../services/useOffer';
import useRatingSeller from '../services/useRatingSeller';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    lineHeight: 30,
  },
  selectedDateContainerStyle: {
    height: 35,
    width: '100%',
    backgroundColor: '#49DA8B',
  },
  selectedDateStyle: {
    fontWeight: '900',
    color: 'white',
  },
  centeredView: {
    flex: 1,
    marginTop: 22,
  },
  modalView: {
    width: Layout.window.width - Layout.baseMargin,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  subtitle2: {
    fontSize: 16,
    marginLeft: 15,
    color: '#757575',
    width: '80%',
  },
  dayText: {
    fontSize: 16,
    paddingVertical: 5,
  },
});

export default function MakePostulationScreen({ navigation, route }) {
  const [currentRating, setCurrentRating] = React.useState(0);
  const [message, setMessage] = React.useState('');
  const [alreadyCalificated, setAlreadyCalificated] = React.useState(true);
  const offerCall = useOffer(route.params.offerId);

  function TextEnvioDonante() {
    return <Text style={styles.subtitle2}>Envío a cargo del donante</Text>;
  }
  const ratingSeller = useRatingSeller();

  const handleRatingSubmit = (postulationId) => {
    ratingSeller.mutate(
      { postulationId, rating: currentRating, message },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: '¡La calificación se ha enviado correctamente!',
            position: 'bottom',
            visibilityTime: 500,
          });
          navigation.navigate('Home');
        },
        onError: (error) => {},
      }
    );
  };
  const offer = offerCall?.data?.data;
  const ownPostulations = offer?.own_postulations || [];

  const postulation = useMakePostulation(route.params.offerId);

  React.useEffect(() => {
    if (!offer || !ownPostulations.length) return;
    const checkCalification = offer?.user?.rating_as_client.find(
      (rating) =>
        rating.user_id === ownPostulations[0].user_id &&
        rating.offer_id === offer.id
    );

    setAlreadyCalificated(checkCalification ? true : false);
  }, [offer, ownPostulations]);

  const [selectedRange, setRange] = React.useState(
    ownPostulations?.length
      ? {
          firstDate: ownPostulations[0].shipment_start_date,
          secondDate: ownPostulations[0].shipment_end_date,
        }
      : {}
  );

  const queryClient = useQueryClient();
  const makePostulation = async (values) => {
    // values.shipment_start_date = selrrectedRange.firstDate;
    // values.shipment_end_date = selectedRange.secondDate;

    postulation.mutate(values, {
      onSuccess: (response) => {
        queryClient.invalidateQueries(['offer', route.params.offerId]);

        Toast.show({
          type: 'success',
          text1: ownPostulations?.length
            ? '¡Has editado tu oferta!'
            : '¡Tu oferta se ha enviado!',
          position: 'bottom',
          visibilityTime: 500,
          onHide: () => {
            navigation.navigate('ViewOwnOffer', {
              id: route.params.offerId,
            });
          },
        });
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: error?.response?.data?.message ?? 'Error al ofertar',
          position: 'bottom',
          visibilityTime: 1000,
        });
      },
    });
  };

  const title = offer?.title;
  const offerType = offer?.offer_type?.id;
  const location = offer?.address?.readable_public;

  const initialValues = {
    shipment_start_date: '',
    shipment_end_date: '',
  };

  initialValues.value_with_shipping = ownPostulations?.length
    ? ownPostulations[0].value_with_shipping
    : '';

  initialValues.value_without_shipping = ownPostulations?.length
    ? ownPostulations[0].value_without_shipping
    : '';

  let content: any;
  const form: any = (
    <>
      {offer?.pending_rating?.length ? (
        <PendingRating rating={offer.pending_rating[0]} />
      ) : null}

      {ownPostulations.length ? (
        <>
          <Text style={styles.text}>
            Tu oferta para {title} en {location} se encuentra{' '}
            <BoldText>Pendiente</BoldText>
          </Text>
          <Text style={styles.text}>
            ¡Todavía estas a tiempo de modificar tu oferta!
          </Text>
          <Spacer size={30} />

          <Text style={[styles.text, { fontStyle: 'italic' }]}>
            Detalles de la oferta
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.text}>
            <BoldText>Propone tu oferta</BoldText> para {title} en {location}.
          </Text>
          <Text style={styles.text}>
            Recuerda que puedes colocar un valor con retiro a tu cargo o bien a
            cargo del vendedor.
          </Text>
          <Text style={styles.text}>¡Tendrás más Posibilidades!</Text>
          <Spacer size={30} />
        </>
      )}
      <Formik initialValues={initialValues} onSubmit={makePostulation}>
        {({ values, handleSubmit, setValues }) => (
          <>
            {offerType === 1 ? (
              <View>
                <View>
                  <TitleOffer>Retira comprador</TitleOffer>
                  <InputOffer
                    color="#90C418"
                    offer={offer}
                    onGet={null}
                    onSet={null}
                    name="value_with_shipping"
                  />
                </View>

                <Spacer size={30} />

                <View>
                  <TitleOffer>Envia vendedor</TitleOffer>
                  <InputOffer
                    color="#FC4850"
                    offer={offer}
                    onGet={selectedRange}
                    onSet={setRange}
                    name="value_without_shipping"
                  />
                </View>
              </View>
            ) : (
              <View>
                <BouncyCheckbox
                  size={25}
                  style={{ marginTop: 30 }}
                  fillColor="#49DA8B"
                  disableBuiltInState
                  unfillColor="#FFFFFF"
                  isChecked={values?.value_with_shipping == 1 ? true : false}
                  onPress={() =>
                    setValues({
                      ...values,
                      value_with_shipping:
                        values.value_with_shipping == 1 ? '0' : '1',
                    })
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
                  onPress={() =>
                    setValues({
                      ...values,
                      value_without_shipping:
                        values.value_without_shipping == 1 ? '0' : '1',
                    })
                  }
                  disableBuiltInState
                  isChecked={values?.value_without_shipping == 1 ? true : false}
                  textComponent={<TextEnvioDonante />}
                  iconStyle={{ borderColor: '#49DA8B' }}
                  textStyle={{
                    textDecorationLine: 'none',
                  }}
                />
              </View>
            )}

            <Spacer size={70} />

            <Button
              type="secondary"
              onPress={handleSubmit}
              disabled={
                offerType === 1
                  ? postulation.isLoading ||
                    !(
                      values.value_with_shipping ||
                      values.value_without_shipping
                    )
                  : postulation.isLoading
              }
            >
              {ownPostulations.length ? 'Editar oferta' : 'OFERTAR'}
            </Button>

            {/* <Spacer size={10} /> */}

            {/* <AskQuestion offerId={route.params.offerId} /> */}
          </>
        )}
      </Formik>
    </>
  );

  const contentAceptado: any = (
    <>
      {offer?.pending_rating?.length ? (
        <PendingRating rating={offer.pending_rating[0]} />
      ) : null}
      <Text style={styles.text}>
        Tu oferta para {title}
        {location && location.length > 1 && ` en ${location}`} ha sido{' '}
        <BoldText>Aceptada</BoldText>
      </Text>

      <Text style={styles.text}>
        {offerType === 1
          ? 'Ya no puedes modificar el valor de tu oferta por este medio.'
          : 'Ya no puedes modificar tu oferta por este medio.'}
      </Text>

      <Spacer size={30} />
      <Text style={[styles.text, { fontStyle: 'italic' }]}>
        Detalles de la oferta
      </Text>
      <Formik initialValues={initialValues} onSubmit={makePostulation}>
        {({ values, handleSubmit }) => (
          <>
            {offerType === 1 ? (
              <View>
                <View>
                  <TitleOffer>Retira comprador</TitleOffer>
                  <InputOffer
                    color="#90C418"
                    disabled
                    offer={offer}
                    onGet={null}
                    onSet={null}
                    name="value_with_shipping"
                  />
                </View>

                <Spacer size={30} />

                <View>
                  <TitleOffer>Envia vendedor</TitleOffer>
                  <InputOffer
                    color="#FC4850"
                    disabled
                    offer={offer}
                    onGet={selectedRange}
                    onSet={setRange}
                    name="value_without_shipping"
                  />
                </View>
              </View>
            ) : (
              <View>
                <BouncyCheckbox
                  size={25}
                  style={{ marginTop: 30 }}
                  fillColor="#49DA8B"
                  disableBuiltInState
                  unfillColor="#FFFFFF"
                  isChecked={values?.value_with_shipping == 1 ? true : false}
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
                  isChecked={values?.value_without_shipping == 1 ? true : false}
                  textComponent={<TextEnvioDonante />}
                  iconStyle={{ borderColor: '#49DA8B' }}
                  textStyle={{
                    textDecorationLine: 'none',
                  }}
                />
              </View>
            )}
          </>
        )}
      </Formik>

      <Spacer size={70} />

      <Button
        onPress={() =>
          navigation.navigate('ChatInternal', {
            toUser: offer.user,
            offerId: offer.id,
          })
        }
        type="secondary"
      >
        <BoldText>IR AL CHAT</BoldText>
      </Button>
    </>
  );

  const contentCancelada: any = (
    <>
      <Text style={styles.text}>
        La {offer?.offer_status_id === 5 ? 'publicación' : 'oferta'} ha sido{' '}
        <BoldText>Cancelada</BoldText>
      </Text>

      <Spacer size={30} />
      <Text style={[styles.text, { fontStyle: 'italic' }]}>
        Detalles de la oferta
      </Text>
      <Formik initialValues={initialValues} onSubmit={makePostulation}>
        {({ values, handleSubmit }) => (
          <>
            {offerType === 1 ? (
              <View>
                <View>
                  <TitleOffer>Retira comprador</TitleOffer>
                  <InputOffer
                    color="#90C418"
                    offer={offer}
                    onGet={null}
                    onSet={null}
                    name="value_with_shipping"
                  />
                </View>

                <Spacer size={10} />

                <View>
                  <TitleOffer>Envia vendedor</TitleOffer>
                  <InputOffer
                    color="#FC4850"
                    offer={offer}
                    onGet={selectedRange}
                    onSet={setRange}
                    name="value_without_shipping"
                  />
                </View>
              </View>
            ) : (
              <View>
                <BouncyCheckbox
                  size={25}
                  style={{ marginTop: 30 }}
                  fillColor="#49DA8B"
                  disableBuiltInState
                  unfillColor="#FFFFFF"
                  isChecked={values?.value_with_shipping == 1 ? true : false}
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
                  isChecked={values?.value_without_shipping == 1 ? true : false}
                  textComponent={<TextEnvioDonante />}
                  iconStyle={{ borderColor: '#49DA8B' }}
                  textStyle={{
                    textDecorationLine: 'none',
                  }}
                />
              </View>
            )}

            <Spacer size={50} />
          </>
        )}
      </Formik>
      <Image
        style={{
          height: 200,
          marginBottom: -60,
          width: '100%',
          resizeMode: 'contain',
        }}
        source={IconCajaBasura}
      />
      <View style={{ marginTop: 10 }}>
        <Button
          onPress={() =>
            navigation.navigate('OfferList', {
              filters: {
                ...Filters.getEmptyFilters(),
                search: '',
              },
            })
          }
          type="secondary"
        >
          <BoldText>SEGUIR BUSCANDO</BoldText>
        </Button>
      </View>
    </>
  );

  const contentRechazado = (
    <>
      <Text style={styles.text}>
        Tu oferta para {title} en {location} ha sido{' '}
        <BoldText>Rechazada</BoldText>
      </Text>

      <Image
        style={{
          height: 200,
          marginBottom: -10,
          width: '100%',
          resizeMode: 'contain',
        }}
        source={IconMostrandoCelular}
      />

      <Spacer size={30} />

      <Text style={[styles.text, { fontStyle: 'italic' }]}>
        Detalles de la oferta
      </Text>
      <Formik initialValues={initialValues} onSubmit={makePostulation}>
        {({ values, handleSubmit, setValues }) => (
          <>
            {offerType === 1 ? (
              <View>
                <View>
                  <TitleOffer>Retira comprador</TitleOffer>
                  <InputOffer
                    color="#90C418"
                    offer={offer}
                    onGet={null}
                    onSet={null}
                    name="value_with_shipping"
                  />
                </View>

                <Spacer size={10} />

                <View>
                  <TitleOffer>Envia vendedor</TitleOffer>
                  <InputOffer
                    color="#FC4850"
                    offer={offer}
                    onGet={selectedRange}
                    onSet={setRange}
                    name="value_without_shipping"
                  />
                </View>
              </View>
            ) : (
              <View>
                <BouncyCheckbox
                  size={25}
                  style={{ marginTop: 30 }}
                  fillColor="#49DA8B"
                  disableBuiltInState
                  unfillColor="#FFFFFF"
                  isChecked={values?.value_with_shipping == 1 ? true : false}
                  onPress={() =>
                    setValues({
                      ...values,
                      value_with_shipping:
                        values.value_with_shipping == 1 ? '0' : '1',
                    })
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
                  onPress={() =>
                    setValues({
                      ...values,
                      value_without_shipping:
                        values.value_without_shipping == 1 ? '0' : '1',
                    })
                  }
                  disableBuiltInState
                  isChecked={values?.value_without_shipping == 1 ? true : false}
                  textComponent={<TextEnvioDonante />}
                  iconStyle={{ borderColor: '#49DA8B' }}
                  textStyle={{
                    textDecorationLine: 'none',
                  }}
                />
              </View>
            )}

            <Spacer size={50} />

            <Button
              type="secondary"
              onPress={handleSubmit}
              disabled={
                offerType === 1
                  ? postulation.isLoading ||
                    !(
                      values.value_with_shipping ||
                      values.value_without_shipping
                    )
                  : postulation.isLoading
              }
            >
              VOLVER A OFERTAR
            </Button>
          </>
        )}
      </Formik>
      <View style={{ marginTop: 10 }}>
        <Button
          onPress={() =>
            navigation.navigate('OfferList', {
              filters: {
                ...Filters.getEmptyFilters(),
                search: '',
              },
            })
          }
          type="secondary"
        >
          <BoldText>SEGUIR BUSCANDO</BoldText>
        </Button>
      </View>
    </>
  );

  const contentFinalizadoRechazado = (
    <>
      <Text style={styles.text}>
        La publicación ya ha <BoldText>Finalizado</BoldText> y tu oferta ha sido{' '}
        <BoldText>rechazada</BoldText>.
      </Text>
      <Text style={styles.text}>
        Lamentablemente esta ves no has sido elegido.
      </Text>
      <Text style={styles.text}>
        ¡No bajes los brazos otras oportunidades te esperan!
      </Text>

      <Spacer size={30} />
      <Text style={[styles.text, { fontStyle: 'italic' }]}>
        Detalles de la oferta
      </Text>
      <Formik initialValues={initialValues} onSubmit={makePostulation}>
        {({ values, handleSubmit }) => (
          <>
            {offerType === 1 ? (
              <View>
                <View>
                  <TitleOffer>Retira comprador</TitleOffer>
                  <InputOffer
                    color="#90C418"
                    disabled
                    offer={offer}
                    onGet={null}
                    onSet={null}
                    name="value_with_shipping"
                  />
                </View>

                <Spacer size={30} />

                <View>
                  <TitleOffer>Envia vendedor</TitleOffer>
                  <InputOffer
                    color="#FC4850"
                    disabled
                    offer={offer}
                    onGet={selectedRange}
                    onSet={setRange}
                    name="value_without_shipping"
                  />
                </View>
              </View>
            ) : (
              <View>
                <BouncyCheckbox
                  size={25}
                  style={{ marginTop: 30 }}
                  fillColor="#49DA8B"
                  disableBuiltInState
                  unfillColor="#FFFFFF"
                  isChecked={values?.value_with_shipping == 1 ? true : false}
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
                  isChecked={values?.value_without_shipping == 1 ? true : false}
                  textComponent={<TextEnvioDonante />}
                  iconStyle={{ borderColor: '#49DA8B' }}
                  textStyle={{
                    textDecorationLine: 'none',
                  }}
                />
              </View>
            )}
          </>
        )}
      </Formik>
      <Image
        style={{
          height: 200,
          marginBottom: -60,
          width: '100%',
          resizeMode: 'contain',
        }}
        source={IconCajaBasura}
      />
      <Button
        onPress={() =>
          navigation.navigate('OfferList', {
            filters: {
              ...Filters.getEmptyFilters(),
              search: '',
            },
          })
        }
        type="secondary"
      >
        <BoldText>SEGUIR BUSCANDO</BoldText>
      </Button>
    </>
  );

  const contentFinalizadoAceptado = (
    <>
      <Text style={styles.text}>
        La publicación ya ha <BoldText>Finalizado con éxito.</BoldText>
      </Text>
      <Text style={styles.text}>
        <BoldText>¡Has sido el elegido!</BoldText>
      </Text>

      <Spacer size={30} />
      <Text style={[styles.text, { fontStyle: 'italic' }]}>
        Detalles de la oferta
      </Text>
      <Formik initialValues={initialValues} onSubmit={makePostulation}>
        {({ values, handleSubmit }) => (
          <>
            {offerType === 1 ? (
              <View>
                <View>
                  <TitleOffer>Retira comprador</TitleOffer>
                  <InputOffer
                    color="#90C418"
                    disabled
                    offer={offer}
                    onGet={null}
                    onSet={null}
                    name="value_with_shipping"
                  />
                </View>

                <Spacer size={30} />

                <View>
                  <TitleOffer>Envia vendedor</TitleOffer>
                  <InputOffer
                    color="#FC4850"
                    disabled
                    offer={offer}
                    onGet={selectedRange}
                    onSet={setRange}
                    name="value_without_shipping"
                  />
                </View>
              </View>
            ) : (
              <View>
                <BouncyCheckbox
                  size={25}
                  style={{ marginTop: 30 }}
                  fillColor="#49DA8B"
                  disableBuiltInState
                  unfillColor="#FFFFFF"
                  isChecked={values?.value_with_shipping == 1 ? true : false}
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
                  isChecked={values?.value_without_shipping == 1 ? true : false}
                  textComponent={<TextEnvioDonante />}
                  iconStyle={{ borderColor: '#49DA8B' }}
                  textStyle={{
                    textDecorationLine: 'none',
                  }}
                />
              </View>
            )}
          </>
        )}
      </Formik>

      <Spacer size={30} />
      {!alreadyCalificated ? (
        <>
          <Text style={[styles.text, { fontStyle: 'italic' }]}>
            Calificá a {offer?.user?.full_name}
          </Text>

          <SetRating onFinishRating={setCurrentRating} />

          <TextInput
            multiline
            style={{
              backgroundColor: '#eee',
              height: 50,
              padding: 10,
              textAlignVertical: 'top',
            }}
            numberOfLines={5}
            onChangeText={(value) => setMessage(value)}
            value={message}
            placeholder="Dejanos un mensaje contando tu experiencia"
          />
          <View style={{ marginTop: 20 }}>
            <Button
              disabled={!currentRating}
              onPress={() => handleRatingSubmit(ownPostulations[0].id)}
              type="secondary"
            >
              Calificar
            </Button>
          </View>
        </>
      ) : (
        <>
          <Image
            style={{
              height: 200,
              marginBottom: -60,
              width: '100%',
              resizeMode: 'contain',
            }}
            source={IconCajaBasura}
          />
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={() =>
                navigation.navigate('OfferList', {
                  filters: {
                    ...Filters.getEmptyFilters(),
                    search: '',
                  },
                })
              }
              type="secondary"
            >
              <BoldText>SEGUIR BUSCANDO</BoldText>
            </Button>
          </View>
        </>
      )}
    </>
  );
  if (ownPostulations.length) {
    /* pendiente */
    if (ownPostulations[0]?.offer_status_id === 1) {
      content = form;
    } else if (
      /* En curso (ACEPTADO) */
      ownPostulations[0]?.offer_status_id === 2
    ) {
      content = contentAceptado;
    } else if (
      /* OFERTA Cancelado */ ownPostulations[0]?.offer_status_id === 5 ||
      offer?.offer_status_id === 5
    ) {
      content = contentCancelada;
      // content = viewCancel(text);
    } else if (/* Rechazado */ ownPostulations[0]?.offer_status_id === 4) {
      content = contentRechazado;
    } else if (ownPostulations[0]?.offer_status_id === 3) {
      content = contentFinalizadoAceptado;
    } else if (ownPostulations[0]?.offer_status_id === 6) {
      content = contentFinalizadoRechazado;
    }
  } else {
    content = form;
  }

  return (
    <>
      <Header rounded={false} />
      <ScrollView>
        <View
          style={{
            minHeight: Dimensions.get('window').height / 1.287,
          }}
        >
          <View style={styles.content}>
            {content}
            <Spacer size={30} />
          </View>
        </View>
        <FooterOffer />
      </ScrollView>
    </>
  );
}

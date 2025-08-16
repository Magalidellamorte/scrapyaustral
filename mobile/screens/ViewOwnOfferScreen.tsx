import * as React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import MapView, {
  Circle,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';
import { useQueryClient } from 'react-query';
import Button from '../components/Button';
import CategoryImage from '../components/CategoryImage';
import CloseOffer from '../components/CloseOffer';
import Divider from '../components/Divider';
import Header from '../components/Header';
import PostulationList from '../components/PostulationList';
import SectionTitle from '../components/SectionTitle';
import Spacer from '../components/Spacer';
import config from '../config/config';
import Layout from '../constants/Layout';
import useMakePostulation from '../services/useMakePostulation';
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

function TextEnvioVendedor() {
  return (
    <Text style={styles.subtitle2}>
      <Text
        style={{
          marginRight: 10,
          color: '#757575',
        }}
      >
        Envío a cargo del vendedor
      </Text>{' '}
      <Text
        style={{
          marginRight: 10,
          color: '#FFF',
        }}
      />
      <Text
        style={{
          fontSize: 12,
          paddingLeft: 10,
          color: '#757575',
          fontStyle: 'italic',
        }}
      >
        (Sujeto a modificaciones en el precio)
      </Text>
    </Text>
  );
}
function TextEnvioDonante() {
  return <Text style={styles.subtitle2}>Envío a cargo del donante</Text>;
}
export default function ViewOwnOfferScreen({ navigation, route }) {
  const { data: loggedUser } = useUser();
  const idsOffers = [1, 2, 4];
  const postulation = useMakePostulation(route.params.id);
  const offerCall = useOffer(route.params.id);

  const offer = offerCall?.data?.data;

  const category = offer?.category?.name;
  const categoryId = offer?.category?.id;

  const title = offer?.title;
  const description = offer?.description;
  const type = offer?.offer_type?.name;
  const postulations = offer?.postulations ?? [];
  const ownPostulations = offer?.own_postulations ?? [];
  const pendingRating = offer?.pending_rating ?? [];
  const mappingType = {
    Donar: 'Donación',
    Vender: 'Venta',
  };

  const mappingTypeActionNew = {
    Donar: 'donaste',
    Vender: 'vendiste',
  };

  const mappingTypeButton = {
    Donar: 'Me interesa',
    Vender: 'Ofertar',
  };

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

  const makePostulationHandler = () => {
    if (!loggedUser?.data?.scraper) {
      Toast.show({
        type: 'error',
        text1: 'Primero debes completar tu perfil',
        position: 'bottom',
        visibilityTime: 4000,
      });
    } else {
      navigation.navigate('MakePostulation', {
        offerId: route.params.id,
      });
    }
  };

  const queryClient = useQueryClient();

  const interestHandler = () => {
    if (!loggedUser?.data?.scraper) {
      Toast.show({
        type: 'error',
        text1: 'Primero debes completar tu perfil',
        position: 'bottom',
        visibilityTime: 4000,
      });
    } else {
      if (ownPostulations?.length) {
        navigation.navigate('MakePostulation', {
          offerId: route.params.id,
        });
      } else {
        postulation.mutate(
          {},
          {
            onSuccess: () => {
              queryClient.invalidateQueries('offer');

              Toast.show({
                type: 'success',
                text1: '¡Te has postulado correctamente!',
                position: 'bottom',
                visibilityTime: 500,
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
          }
        );
      }
    }
  };

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

          <Text
            style={[
              styles.type,
              type === 'Donar' ? styles.typeDonation : styles.typeSell,
            ]}
          >
            {mappingType[type]}
          </Text>

          <View style={styles.contentContainer}>
            <CategoryImage
              value={categoryId}
              style={{ width: 50, height: 50 }}
            />
            <Text style={styles.category}>{category}</Text>

            <Text style={styles.title}>{title}</Text>

            <Text>{description}</Text>

            <Divider />

            <Text style={styles.titleSection}>Detalles del material</Text>

            <Spacer size={20} />

            <Text>
              Cantidad: {offer?.quantity} {offer?.measure_type?.name}
            </Text>

            <Text>Estado: {offer?.condition?.name}</Text>

            {type === 'Vender' ? (
              <>
                <Divider />

                <Text style={styles.titleSection}>
                  Valores esperados por {offer?.measure_type?.name}
                </Text>
                <Text
                  style={{ color: 'grey', fontStyle: 'italic', marginTop: 10 }}
                >
                  Este valor no incluye transporte del material.
                </Text>

                <Spacer size={20} />

                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      flex: 0.5,
                      paddingEnd: 20,
                      borderWidth: 1,
                      borderColor: '#39b76f',
                      width: '100%',
                      borderRadius: 10,
                      padding: 10,
                    }}
                  >
                    {offer?.value_with_shipping ? (
                      <Text>${offer?.value_with_shipping}</Text>
                    ) : (
                      <Text
                        style={{
                          color: 'grey',
                        }}
                      >
                        No especifica.
                      </Text>
                    )}
                  </View>

                  {/* <View style={{ flex: 0.5 }}>
                    <Text>Sin retiro</Text>
                    <Text>
                      {offer?.value_without_shipping
                        ? `$${offer?.value_without_shipping}`
                        : 'No especifica.'}
                    </Text>
                  </View> */}
                </View>
              </>
            ) : null}

            <Divider />
            <Text style={styles.titleSection}>Retiro del material</Text>

            <BouncyCheckbox
              size={25}
              style={{ marginTop: 30 }}
              fillColor="#49DA8B"
              disableBuiltInState
              unfillColor="#FFFFFF"
              isChecked={
                offer?.pick_by_scraper ||
                (!offer?.pick_by_scraper && !offer?.send_by_client)
              }
              textComponent={
                type !== 'Donar' ? (
                  <Text style={styles.subtitle2}>
                    Retiro a cargo del comprador
                  </Text>
                ) : (
                  <Text style={styles.subtitle2}>
                    Retiro a cargo del interesado
                  </Text>
                )
              }
              iconStyle={{ borderColor: '#49DA8B' }}
              textStyle={{
                textDecorationLine: 'none',
              }}
            />

            <BouncyCheckbox
              style={{ marginTop: 10 }}
              size={25}
              fillColor="#49DA8B"
              unfillColor="#FFFFFF"
              disableBuiltInState
              isChecked={
                offer?.send_by_client ||
                (!offer?.pick_by_scraper && !offer?.send_by_client)
              }
              textComponent={
                type !== 'Donar' ? <TextEnvioVendedor /> : <TextEnvioDonante />
              }
              iconStyle={{ borderColor: '#49DA8B' }}
              textStyle={{
                textDecorationLine: 'none',
              }}
            />

            {isOwnOffer ? (
              // idsOffers.includes(offer.offer_status_id) ? (
              <>
                <Divider color="#D3D3D333" height={20} />

                <Text style={styles.titleSection}>Ofertas</Text>

                <Spacer size={20} />

                {postulations.length ? (
                  postulations.map((postulation, index) => (
                    <PostulationList
                      key={postulation.id || index}
                      postulation={postulation}
                    />
                  ))
                ) : (
                  <Text style={styles.centered}>
                    No has recibido ofertas aún.
                  </Text>
                )}
              </>
            ) : // ) : (
            //   <>
            //     <Divider color="#D3D3D333" height={20} />

            //     <View>
            //       <Text>Anuncio {offer.offer_status.name}</Text>
            //     </View>

            //     <Spacer size={20} />

            //     {pendingRating.length ? (
            //       <PendingRating rating={pendingRating[0]} />
            //     ) : null}
            //   </>
            // )
            null}
            <Divider color="#D3D3D333" height={20} />

            {/* comentado por cambio de esquema */}
            {/* {!isOwnOffer ? (
              <ProfileLite user={offer?.user} goToProfile />
            ) : null} */}
            <View>
              <SectionTitle
                icon="map-marker"
                title="Ubicación"
                subtitle={offer?.address?.readable_public}
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
                    <Circle
                      center={{
                        latitude: parseFloat(offer?.address?.latitude ?? 0),
                        longitude: parseFloat(offer?.address?.longitude ?? 0),
                      }}
                      radius={1000}
                      strokeColor="#49DA8B"
                      fillColor="#49DA8B33"
                    />
                  </MapView>
                </>
              ) : null}

              <Spacer />
              <Button
                type="secondary"
                onPress={() => {
                  const text =
                    'Hola, me interesa:  ' + title + ' - #' + offer?.id;
                  const url = `https://wa.me/5491133019016?text=${encodeURIComponent(
                    text
                  )}`;
                  Linking.openURL(url).catch((err) =>
                    console.error('Error al abrir WhatsApp', err)
                  );
                }}
              >
                Negociar Material
              </Button>
              <Spacer />
              <Spacer />

              {/* comentado por cambio de esquema */}
              {/* {isOwnOffer ? null : type === 'Donar' ? (
                <Button type="secondary" onPress={interestHandler}>
                  {ownPostulations?.length
                    ? 'Ver mi oferta'
                    : mappingTypeButton[type] ?? ''}
                </Button>
              ) : (
                <Button type="secondary" onPress={makePostulationHandler}>
                  {ownPostulations?.length
                    ? 'Ver mi oferta'
                    : mappingTypeButton[type] ?? ''}
                </Button>
              )} */}
            </View>
          </View>

          {isOwnOffer ? (
            idsOffers.includes(offer.offer_status_id) ? (
              <>
                <Divider color="#D3D3D333" height={20} />

                <CloseOffer
                  type={type}
                  offerId={offer?.id}
                  postulations={postulations || []}
                />
                <Spacer size={20} />
              </>
            ) : (
              <></>
            )
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}

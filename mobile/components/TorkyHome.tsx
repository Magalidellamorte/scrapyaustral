import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import get from 'lodash/get';
import * as React from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../components/Button';
import Header from '../components/Header';
import Maps from '../components/Maps';
import OfferTorky from '../components/OfferTorky';
import Spacer from '../components/Spacer';
import Title from '../components/Title';
import Layout from '../constants/Layout';
import getProfilePicturePath from '../helpers/getProfilePicturePath';
import useToggle from '../hooks/useToggle';
import useOffers from '../services/useOffers';
import useUser from '../services/useUser';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
    position: 'relative',
  },
  content: {
    flexGrow: 1,
    paddingBottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 250,
    position: 'relative',
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
  fixedButtonContainer: {
    position: 'absolute', // Asegura que el botón no esté en el flujo de la pantalla
    bottom: 160, // Distancia desde la parte inferior
    left: 0,
    right: 0,
    alignItems: 'center', // Centra el botón horizontalmente
    zIndex: 1000, // Garantiza que esté por encima del contenido
  },
  viewButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.3,
  },

  viewContainer: {
    alignContent: 'center',
    alignItems: 'center',
    width: Layout.window.width,
    position: 'absolute',
    bottom: 160,
    zIndex: 1,
    left: 0,
    right: 0,
  },
  shadowProp: {
    shadowColor: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.5,
  },
});

export default function OfferListScreeen({ route = {} }) {
  const { data: user } = useUser();
  const userData = get(user, 'data', {});
  const navigation = useNavigation();

  const [view, setView] = useToggle(false);

  const [location, setLocation] = React.useState({
    coords: { latitude: -34.0991587, longitude: -59.0262511 },
    show: false,
  });
  const filters = {
    conditions: [],
    offerTypes: [],
    range: 100,
    categories: [],
    offerStatuses: [],
    type: 'torky',
  };

  const offersCall = useOffers(0, filters);
  const pages = get(offersCall, 'data.pages', []);

  const onRefresh = () => {
    offersCall.refetch();
  };

  const scrollViewRef = React.useRef<ScrollView>(null);

  const toggleView = () => {
    setView(!view);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

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
        show: true,
      });
    })();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      // Verificamos si el evento viene de un back o forward
      if (e.data?.action?.type === 'GO_BACK') {
        console.log('Navegación desde back');
      }
      onRefresh();
    });

    return unsubscribe;
  }, [navigation]);

  const items = view ? (
    <Maps
      userData={userData}
      filters={filters}
      torky={true}
      pages={pages}
      location={location}
      onLocationSet={setLocation}
    />
  ) : (
    <>
      {pages.map((page) =>
        get(page, 'data[0].data', []).map((offer) => (
          <OfferTorky
            key={offer?.id}
            id={offer?.id}
            offer={offer}
            category={offer?.category?.name}
            name={offer?.user?.full_name}
            rating={offer?.user?.rating_average}
            profilePicture={getProfilePicturePath(offer.user ?? {})}
            title={offer?.title}
            type={offer?.offer_type?.name}
            picture={offer.images?.length > 0 ? offer.images[0].path : null}
            location={offer?.address?.readable}
            user={offer?.user}
          />
        ))
      )}

      {offersCall.isFetchingNextPage || offersCall.hasNextPage ? (
        <Button
          type="secondary"
          onPress={() => offersCall.fetchNextPage()}
          disabled={!offersCall.hasNextPage || offersCall.isFetchingNextPage}
        >
          {offersCall.isFetchingNextPage
            ? 'Cargando más...'
            : offersCall.hasNextPage
            ? 'Cargar más'
            : 'No hay mas resultados'}
        </Button>
      ) : null}

      <Spacer />
    </>
  );
  return (
    <>
      <Header rounded={false} />
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          refreshControl={
            !view ? (
              <RefreshControl
                onRefresh={onRefresh}
                refreshing={offersCall.isLoading || offersCall.isFetching}
              />
            ) : null
          }
        >
          <View style={styles.content}>
            <Title>Anuncios</Title>
            {!get(pages, '[0].data[0].data', []).length ? (
              offersCall.isLoading ? null : (
                <Text style={styles.noOffers}>
                  Ningún anuncio coincide con tu búsqueda
                </Text>
              )
            ) : (
              items
            )}
          </View>
        </ScrollView>

        {/* El botón fijo debe estar fuera del ScrollView */}
        <View style={styles.fixedButtonContainer}>
          <View style={[styles.viewButton, styles.shadowProp]}>
            <Button onPress={toggleView} size="small">
              Ver {view ? 'listado' : 'mapa'}{' '}
              {view ? (
                <FontAwesome size={15} name="list" />
              ) : (
                <FontAwesome size={15} name="map" />
              )}
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}

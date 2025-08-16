import { FontAwesome } from '@expo/vector-icons';
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
import Filters from '../components/Filters';
import Header from '../components/Header';
import Maps from '../components/Maps';
import Offer from '../components/Offer';
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
  const { data: user } = useUser();
  const userData = get(user, 'data', {});

  const [view, setView] = useToggle(false);
  const [location, setLocation] = React.useState({
    coords: { latitude: -34.6037389, longitude: -58.3837591 },
    show: false,
  });

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

  const [filters, setFilters] = React.useState({
    ...route.params.filters,
    range: parseInt(userData?.coverage_range || '100', 10),
  });
  const offersCall = useOffers(0, filters || {});
  const pages = get(offersCall, 'data.pages', []);

  const onRefresh = () => {
    offersCall.refetch();
  };

  React.useEffect(() => {
    onRefresh();
  }, [filters]);

  const items = view ? (
    <Maps
      userData={userData}
      torky={false}
      filters={filters}
      pages={pages}
      location={location}
      onLocationSet={setLocation}
    />
  ) : (
    <>
      {pages.map((page) =>
        get(page, 'data[0].data', []).map((offer) => (
          <Offer
            key={offer?.id}
            id={offer?.id}
            category={offer?.category?.name}
            name={offer?.user?.full_name}
            rating={offer?.user?.rating_average}
            profilePicture={getProfilePicturePath(offer.user ?? {})}
            title={offer?.title}
            type={offer?.offer_type?.name}
            picture={offer.images?.length > 0 ? offer.images[0].path : null}
            location={offer?.address?.readable_public}
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

          <View style={styles.filtersContainer}>
            <Filters
              filters={filters}
              onFiltersSet={setFilters}
              toShow={['offerTypes', 'conditions', 'categories', 'range']}
            />
          </View>

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
      <View style={styles.viewContainer}>
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
    </>
  );
}

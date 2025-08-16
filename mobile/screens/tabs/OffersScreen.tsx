import * as React from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import { get } from 'lodash';
import Button from '../../components/Button';
import Filters from '../../components/Filters';
import Header from '../../components/Header';
import Offer from '../../components/Offer';
import OfferTorky from '../../components/OfferTorky';
import Spacer from '../../components/Spacer';
import { Text, View } from '../../components/Themed';
import Title from '../../components/Title';
import getProfilePicturePath from '../../helpers/getProfilePicturePath';
import useOwnOffers from '../../services/useOwnOffers';
import useUser from '../../services/useUser';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 130,
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
});

export default function OffersScreen() {
  const { data: user } = useUser();
  const ComponentOffer = user?.data.type === 'hogar' ? OfferTorky : Offer;

  const [filters, setFilters] = React.useState(Filters.getEmptyFilters());

  const offers = useOwnOffers(filters);

  const pages = get(offers, 'data.pages', []);

  const onRefresh = () => {
    offers.refetch();
  };

  React.useEffect(() => {
    onRefresh();
  }, [filters]);

  return (
    <>
      <Header rounded={false} />

      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={offers.isLoading || offers.isFetching}
          />
        }
      >
        <View style={styles.content}>
          <Title>Mis anuncios</Title>

          <View style={styles.filtersContainer}>
            <Filters
              onFiltersSet={setFilters}
              toShow={[
                'offerStatuses',
                'offerTypes',
                'conditions',
                'categories',
              ]}
            />
          </View>

          <Spacer />

          {!get(pages, '[0].data[0].data', []).length ? (
            <Text style={styles.noOffers}>No tienes anuncios publicados</Text>
          ) : (
            <>
              {pages.map((page) =>
                get(page, 'data[0].data', []).map((offer) => (
                  <ComponentOffer
                    myOffer
                    offer={offer}
                    key={offer.id}
                    id={offer.id}
                    category={offer.category.name}
                    name={offer.user.full_name}
                    profilePicture={getProfilePicturePath(offer?.user ?? {})}
                    rating={offer?.user?.rating_average}
                    title={offer.title}
                    type={offer.offer_type.name}
                    picture={
                      offer?.images.length > 0 ? offer.images[0].path : null
                    }
                    location={offer.address.readable_public}
                    status={offer.offer_status}
                    statusText="MyOffer"
                    user={offer.user}
                  />
                ))
              )}

              {offers.isFetchingNextPage || offers.hasNextPage ? (
                <Button
                  type="secondary"
                  onPress={() => offers.fetchNextPage()}
                  disabled={!offers.hasNextPage || offers.isFetchingNextPage}
                >
                  {offers.isFetchingNextPage
                    ? 'Cargando más...'
                    : offers.hasNextPage
                    ? 'Cargar más'
                    : 'No hay mas resultados'}
                </Button>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

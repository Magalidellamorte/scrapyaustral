import * as React from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';
import { get } from 'lodash';
import { View } from '../../components/Themed';
import Header from '../../components/Header';
import Publication from '../../components/Publication';
import Layout from '../../constants/Layout';
import useUser from '../../services/useUser';
import useOwnPostulations from '../../services/useOwnPostulations';
import config from '../../config/config';
import Spacer from '../../components/Spacer';
import Filters from '../../components/Filters';
import hasActiveSubscription from '../../helpers/hasActiveSubscrription';
import getProfilePicturePath from '../../helpers/getProfilePicturePath';
import Button from '../../components/Button';
import Title from '../../components/Title';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 130,
    paddingTop: 10,
    minHeight: Layout.window.height - 100,
  },
  noPostulations: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  filtersContainer: {
    position: 'absolute',
    right: 20,
    top: 5,
  },
});

export default function ApplicationsScreen() {
  const [filters, setFilters] = React.useState(Filters.getEmptyFilters());

  const { data: user } = useUser();
  const postulationsCall = useOwnPostulations(filters);
  const pages = get(postulationsCall, 'data.pages', []);

  const onRefresh = () => {
    postulationsCall.refetch();
  };

  React.useEffect(() => {
    onRefresh();
  }, [filters]);

  if (!user?.data?.scraper) {
    return (
      <>
        <Header refreshPage={Math.random()} rounded={false} />
        <View style={styles.content}>
          <Text style={styles.noPostulations}>
            Para tener postulaciones deber ser comprador
          </Text>
        </View>
      </>
    );
  }

  // if (!hasActiveSubscription(get(user, 'data.subscriptions', []))) {
  //   return (
  //     <>
  //       <Header rounded={false} />
  //       <View style={styles.content}>
  //         <Text style={styles.noPostulations}>
  //           ¡No tienes una subscripción de comprador activa!
  //         </Text>
  //       </View>
  //     </>
  //   );
  // }

  return (
    <>
      <Header rounded={false} />
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={
              postulationsCall.isLoading || postulationsCall.isFetching
            }
          />
        }
      >
        <View style={styles.content}>
          <Title>Mis postulaciones</Title>

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

          {pages.map((page) =>
            get(page, 'data.data', []).map((postulation) => (
              <Publication
                user={postulation.offer.user}
                key={postulation.id}
                offerId={postulation.offer.id}
                category={postulation.offer.category.name}
                name={postulation.offer.user.full_name}
                profilePicture={getProfilePicturePath(
                  postulation.offer.user ?? {}
                )}
                title={postulation.offer.title}
                type={postulation.offer.offer_type.name}
                picture={`${config.STORAGE_PATH}${
                  postulation?.offer?.images[0]?.path ?? ''
                }`}
                location={postulation.offer.address.readable_public}
                status={postulation.offer_status}
              />
            ))
          )}

          {get(pages, '[0].data.data[0]', []).length ? (
            <Text style={styles.noPostulations}>
              No te has postulado a ningun anuncio
            </Text>
          ) : !postulationsCall.hasNextPage ||
            postulationsCall.isFetchingNextPage ? null : (
            <Button
              type="secondary"
              onPress={() => postulationsCall.fetchNextPage()}
              disabled={
                !postulationsCall.hasNextPage ||
                postulationsCall.isFetchingNextPage
              }
            >
              {postulationsCall.isFetchingNextPage
                ? 'Cargando más...'
                : postulationsCall.hasNextPage
                ? 'Cargar más'
                : 'No hay más resultados'}
            </Button>
          )}
        </View>
      </ScrollView>
    </>
  );
}

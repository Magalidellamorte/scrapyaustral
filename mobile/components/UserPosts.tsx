/* eslint-disable global-require */
import get from 'lodash/get';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import useOffers from '../services/useOffers';
import Filters from './Filters';
import Offer from './Offer';
import Title from './Title';
const stylesCarousel = StyleSheet.create({
  carouselContainer: {},
  carouselContentContainer: {},
});
const styles = StyleSheet.create({
  ratingText: { flex: 0.3, alignItems: 'center' },
});
type UserPostsProps = {
  user?: any;
};

const renderCarouselitem = ({ item: offer }) => {
  const image = offer.images?.length > 0 ? offer.images[0].path : null;
  return (
    <Offer
      key={offer.id}
      id={offer.id}
      category={offer.category?.name}
      title={offer.title}
      rating={offer?.user?.rating_average}
      type={offer.offer_type?.name}
      picture={image}
      location={offer.address?.readable_public}
      user={offer.user}
    />
  );
};

function UserPosts({ user }: UserPostsProps) {
  const filterLastOfferByUser: any = {
    ...Filters.getEmptyFilters(),
    offerStatuses: [1, 2],
    userId: user?.data?.id,
    view: 'last_offers',
  };
  const offers = useOffers(10, filterLastOfferByUser);
  const offersData = get(offers, 'data.pages[0].data[0].data', []);
  return (
    <>
      {offersData.length > 0 && (
        <>
          <View style={{ marginTop: 40 }}>
            <Title>Publicaciones</Title>
            {/* <Carousel
              activeSlideOffset={0}
              data={offersData}
              renderItem={renderCarouselitem}
              sliderWidth={Layout.window.width - Layout.baseMargin}
              itemWidth={Layout.window.width - Layout.baseMargin * 2}
              containerCustomStyle={stylesCarousel.carouselContainer}
              contentContainerCustomStyle={
                stylesCarousel.carouselContentContainer
              }
            /> */}
          </View>
        </>
      )}
    </>
  );
}

UserPosts.defaultProps = {
  user: {},
};

export default UserPosts;

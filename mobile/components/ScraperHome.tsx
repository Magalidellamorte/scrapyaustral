import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import get from 'lodash/get';
import React, { useEffect } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Layout from '../constants/Layout';
import { useGlobalState } from '../context/GlobalStateContext';
import useCategoryList from '../services/useCategoryList';
import useOffers from '../services/useOffers';
import useUser from '../services/useUser';
import Button from './Button';
import CategoryItem from './CategoryItem';
import Filters from './Filters';
import Offer from './Offer';
import Spacer from './Spacer';
import Title from './Title';
import TextInput from './fields/TextInputNoFormik';
const { width } = Dimensions.get('window');

const stylesCarousel = StyleSheet.create({
  carouselContainer: {
    paddingHorizontal: 10,
  },
  carouselContentContainer: {
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  blockImage: {
    width: 110,
  },
  personimage: {
    position: 'absolute',
    bottom: -80,
    left: -10,
    width: 120,
    height: 200,
  },
  bloquew: {
    position: 'absolute',
    width: '58%',
    right: Layout.window.width > 330 ? 15 : 5,
    top: Layout.window.width > 330 ? 15 : 5,
  },
  imagep: {
    width: '100%',
    position: 'absolute',
  },
  container: {},
  text: {
    fontSize: 20,
    fontWeight: '900',
  },
  textQuieres: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 13,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: '900',
  },
  boxConvert: {
    height: 130,
    overflow: 'hidden',
    fontSize: 20,
    padding: 10,
    flexDirection: 'row',
    elevation: 1,
    backgroundColor: '#60d1e1',
    color: 'white',
    borderRadius: 30,
    display: 'flex',
    fontWeight: 'normal',
  },
  button: {
    overflow: 'hidden',
    backgroundColor: 'white',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '900',
    paddingHorizontal: 2,
    borderRadius: 50,
  },
  shadowProp: {
    // elevation: 10,
    // shadowColor: 'red',
    // shadowOffset: { width: -2, height: 4 },
    // shadowOpacity: 1,
    // shadowRadius: 3,
  },
  image: {
    maxHeight: 250,

    left: -20,
    resizeMode: 'contain',
  },
});

const baseFilters = {
  ...Filters.getEmptyFilters(),
  offerStatuses: [1],
};

const filterLastOffer = {
  ...Filters.getEmptyFilters(),
  offerStatuses: [1],
  view: 'last_offers',
};

const ScraperHome = () => {
  const navigation = useNavigation();
  const categories = useCategoryList();
  // const offers = useOffers(5, baseFilters);
  const offers = useOffers(5, filterLastOffer);
  const userCall = useUser();
  const { setGlobalState, globalState } = useGlobalState();
  const { data: user } = userCall;
  const { token } = globalState;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setGlobalState({ ...{ menuActive: false } });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setGlobalState({ ...{ menuActive: true } });
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [searchText, setSearchText] = React.useState('');

  const categoriesOptions = get(categories, 'data.data', []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const offersData = get(offers, 'data.pages[0].data[0].data', []);

  const [category, setCategory] = React.useState();

  const onSearchPress = React.useCallback(() => {
    navigation.navigate('OfferList', {
      filters: {
        ...baseFilters,
        search: searchText,
      },
    });
  }, [searchText]);

  const inputAction = () => (
    <Button
      type="secondary"
      onPress={onSearchPress}
      styleButton={{
        paddingTop: 10,
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        paddingBottom: 8,
      }}
      // disabled={!searchText}
    >
      <FontAwesome name="search" size={16} color="white" />
    </Button>
  );

  const renderCarouselItem = ({ item: offer }) => {
    const image = offer.images?.length > 0 ? offer.images[0].path : null;
    return (
      <View style={{ paddingHorizontal: 20 }}>
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
      </View>
    );
  };

  // const renderCarouselitem = ({ item: offer }) => {
  //   const image = offer.images?.length > 0 ? offer.images[0].path : null;
  //   return (
  //     <Offer
  //       key={offer.id}
  //       id={offer.id}
  //       category={offer.category?.name}
  //       title={offer.title}
  //       rating={offer?.user?.rating_average}
  //       type={offer.offer_type?.name}
  //       picture={image}
  //       location={offer.address?.readable_public}
  //       user={offer.user}
  //     />
  //   );
  // };

  // if (!user?.data?.scraper) {
  //   return (
  //     <>
  //       <Spacer size={120} />
  //       <View style={styles.container}>
  //         {token ? (
  //           <>
  //             <Title>Convertite en comprador</Title>

  //             <Spacer size={10} />

  //             <View style={[styles.boxConvert, styles.shadowProp]}>
  //               <View style={styles.blockImage}>
  //                 <Image source={PersonImg} style={styles.personimage} />
  //               </View>
  //               <View style={styles.bloquew}>
  //                 <Title
  //                   style={{
  //                     color: 'white',
  //                     textAlign: 'center',
  //                     marginBottom: 10,
  //                     fontSize: 14,
  //                   }}
  //                 >
  //                   ¿Querés ser comprador?
  //                 </Title>
  //                 <Text style={[styles.textQuieres, { textAlign: 'center' }]}>
  //                   ¡Convertite ahora mismo!
  //                 </Text>

  //                 <View>
  //                   <Button
  //                     onPress={() =>
  //                       token
  //                         ? navigation.navigate('BeScraper')
  //                         : navigation.navigate('LogIn')
  //                     }
  //                     style={styles.button}
  //                     type="radiusBeScrapper"
  //                   >
  //                     Quiero comprar
  //                   </Button>
  //                 </View>
  //               </View>
  //             </View>
  //           </>
  //         ) : (
  //           <>
  //             <Title>Sección de compras y donaciones</Title>

  //             <Spacer size={10} />

  //             <View style={[styles.boxConvert, styles.shadowProp]}>
  //               <Text
  //                 style={[
  //                   styles.textQuieres,
  //                   {
  //                     textAlign: 'center',
  //                     width: '100%',
  //                     marginTop: 30,
  //                     fontWeight: 'bold',
  //                     fontSize: 16,
  //                   },
  //                 ]}
  //               >
  //                 En esta sección se mustran los anuncios de compras y
  //                 donaciones de los usuarios.
  //               </Text>
  //             </View>
  //           </>
  //         )}
  //       </View>
  //     </>
  //   );
  // }

  return (
    <Formik>
      <View styles={styles.container}>
        <Spacer size={80} />

        <TextInput
          name="search"
          style={{
            borderRadius: 10,
            borderColor: '#d1d1d1',
            borderWidth: 1,
            height: 43,
            paddingHorizontal: 15,
            marginVertical: 10,
          }}
          placeholderTextColor="#ccc"
          placeholder="¿Qué estás buscando?"
          action={inputAction()}
          onChange={(value) => setSearchText(value)}
        />

        <Spacer size={20} />

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          {categoriesOptions.map(({ label, value }) => (
            <CategoryItem
              size={Layout.window.width / 3.87}
              key={`${value}`}
              value={value}
              onPress={() => {
                // setCategory(value);
                navigation.navigate('OfferList', {
                  filters: {
                    ...baseFilters,
                    categories: [value],
                  },
                });
              }}
              selected={category === value}
              label={label}
            />
          ))}
        </View>

        <Button
          type="primary"
          onPress={() =>
            navigation.navigate('OfferList', {
              filters: baseFilters,
            })
          }
        >
          Ver todo
        </Button>

        <Spacer size={20} />

        <Title>Últimos anuncios</Title>
        <View style={{ flex: 1 }}>
          {!offersData.length ? (
            <Text style={styles.noOffers}>
              No tenemos ningún anuncio para vos
            </Text>
          ) : (
            <Carousel
              width={width - 40}
              height={width}
              data={offersData}
              renderItem={renderCarouselItem}
              scrollAnimationDuration={1000}
              style={stylesCarousel.carouselContainer}
            />
          )}
        </View>
      </View>
    </Formik>
  );
};

export default ScraperHome;

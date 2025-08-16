import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
// import Video from 'react-native-video';

import Layout from '../constants/Layout';
import Button from './Button';
import Spacer from './Spacer';

import recicla from '../assets/images/scrapy-recicla.gif';
import useUser from '../services/useUser';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
  },
  image: {
    height: Layout.window.width / 2,
    width: Layout.window.width / 2,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

const ClientHome = () => {
  const navigation = useNavigation();
  const { data: user } = useUser();

  const newScrapHandler = () => {
    // TODO: check if is logged in.
    navigation.navigate('NewScrapSecondHogar', {
      offertType: 'hogar',
      categoriesFetch: [],
      categories: [],
    });
  };

  return (
    <>
      <Spacer size={90} />
      <Image style={styles.image} source={recicla} />

      <Spacer size={40} />

      <Text style={styles.text}>
        Junta tus reciclables, avisanos y una recicladoras Pasaremos a
        retirarlo.
      </Text>

      <Spacer size={30} />

      <Button
        type="secondary"
        onPress={newScrapHandler}
        // icon={IconPic}
        disabled={!user?.data?.id}
      >
        Solicitar retiro
      </Button>
    </>
  );
};

export default ClientHome;

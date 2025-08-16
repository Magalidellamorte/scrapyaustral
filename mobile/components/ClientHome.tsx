import React, { Component, Fragment } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import Video from 'react-native-video';

import Spacer from './Spacer';
import Button from './Button';
import Layout from '../constants/Layout';

import recicla from '../assets/images/scrapy-recicla.gif';
import useUser from '../services/useUser';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: "900",
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
    navigation.navigate('NewScrap');
  };

  return (
    <>
      <Spacer size={90} />
      <Image style={styles.image} source={recicla} />

      <Spacer size={40} />

      <Text style={styles.text}>
        Publicá el Scrap que quieras vender o donar
      </Text>

      <Text style={styles.text}>y recibí distintas ofertas de compradores</Text>

      <Spacer size={30} />

      <Button
        type="secondary"
        onPress={newScrapHandler}
        disabled={!user?.data?.id}
      >
        Publicá tu Scrap
      </Button>
    </>
  );
};

export default ClientHome;

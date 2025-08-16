import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import WithoutChat from '../assets/images/sinchat.svg';
import Button from './Button';
import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Layout.window.height - 300,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: '#858585',
  },
});

const EmptyChatHistory = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <>
        <WithoutChat width={200} height={200} />

        <View style={{ height: 20 }} />

        <Text style={styles.text}>Aún no tenés ningún chat</Text>

        <View style={{ height: 50 }} />

        <Button
          type="primary"
          style={{ paddingHorizontal: 50 }}
          onPress={() => navigation.navigate('OwnOffers')}
        >
          Ver anuncios
        </Button>
      </>
    </View>
  );
};

export default EmptyChatHistory;

import * as React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileLite from './ProfileLite';

import Layout from '../constants/Layout';

type PublicationProps = {
  category: string;
  subcategory: string;
  name: string;
  profilePicture: string;
  title: string;
  type: string;
  picture: string;
  postulation: boolean;
  location: string;
  status: string;
  user: any;
  offerId: number;
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: 'white',
  },
  picture: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: Layout.window.width - Layout.baseMargin + 10,
    height: 200,
  },
  content: {
    padding: 20,
  },
  category: {
    textTransform: 'uppercase',
    fontSize: 10,
    color: '#858585',
  },
  title: {
    fontWeight: '900',
    fontSize: 18,
  },
  location: {
    fontSize: 12,
    color: '#858585',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  profilePictureContainer: {
    overflow: 'visible',
    elevation: 2,
    borderRadius: 100,
    height: 50,
    width: 50,
  },
  profilePictureImage: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
  },
  typeDonation: {
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 5,
    backgroundColor: '#dbfff0',
    color: '#047e4b',
  },
  typeSell: {
    borderRadius: 10,
    overflow: 'hidden',
    top: 10,
    right: 10,
    position: 'absolute',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#49DA8B',
    color: 'white',
  },
  status: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    width: 'auto',
    textAlign: 'center',
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});

const mappingType = {
  Donar: 'Donación',
  Vender: 'Venta',
};

function Publication({
  offerId,
  category,
  subcategory,
  name,
  title,
  type,
  location,
  postulation,
  picture,
  user,
  status,
}: PublicationProps) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('MakePostulation', {
          offerId,
        });
      }}
    >
      <View style={[styles.container, styles.shadowProp]}>
        {picture ? (
          <Image source={{ uri: picture }} style={styles.picture} />
        ) : null}

        {type ? (
          <Text
            style={[
              type === 'Donar' ? styles.typeDonation : styles.typeSell,
              styles.shadowProp,
            ]}
          >
            {mappingType[type]}
          </Text>
        ) : null}
        {status ? (
          <Text
            style={[
              styles.status,
              styles.shadowProp,
              {
                borderRadius: 10,
                fontSize: 12,
                overflow: 'hidden',
                color: status.color_text,
                backgroundColor: status.color_background,
              },
            ]}
          >
            {postulation ? <Text>Oferta </Text> : null}
            {status.name}
          </Text>
        ) : null}
        <View style={styles.content}>
          <Text style={styles.category}>
            {category || ''}
            {subcategory ? ` - ${subcategory}` : ''}
          </Text>

          {title ? <Text style={styles.title}>{title}</Text> : null}

          {location ? <Text style={styles.location}>{location}</Text> : null}
          <ProfileLite user={user} />
        </View>
      </View>
    </Pressable>
  );
}

Publication.defaultProps = {};

export default Publication;

import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import sinFoto from '../assets/images/sin_foto.png';
import config from '../config/config';
import useUser from '../services/useUser';

type OfferProps = {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  profilePicture: string;
  title: string;
  rating: string;
  type: string;
  picture: string;
  location: string;
  myOffer: boolean;
  status: string;
  statusText: string;
  user: {
    id: string;
  };
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: 'white',
  },
  container2: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  picture: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  sinFoto: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    resizeMode: 'contain',
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
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#dbfff0',
    color: '#047e4b',
  },
  typeSell: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#49DA8B',
    color: 'white',
  },
  shadowProp: {
    shadowColor: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    // android specific
    elevation: 10,
    // ios specific
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },

  shadowProp2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  type: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    // width: ,
    textAlign: 'center',
  },
});

function Offer({
  id,
  category,
  subcategory,
  name,
  title,
  myOffer,
  type,
  location,
  statusText,
  picture,
  rating,
  profilePicture,
  status,
  user,
}: OfferProps) {
  const { data: loggedUser } = useUser();

  const navigation = useNavigation();

  const mappingType = {
    Donar: 'Donación',
    Vender: 'Venta',
  };

  return (
    <Pressable
      onPress={async () => {
        navigation.navigate('ViewOwnOffer', { id });
      }}
    >
      <View
        style={[
          styles.container,
          Platform.OS === 'ios'
            ? styles.shadowProp2
            : // { borderColor: '#eee', borderStyle: 'solid', borderWidth: 1 }
              {},
        ]}
      >
        <View style={[styles.container2]}>
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              backgroundColor: '#eee',
            }}
          >
            {picture ? (
              <Image
                source={{ uri: config.STORAGE_PATH + picture }}
                style={styles.picture}
              />
            ) : (
              <Image source={sinFoto} style={styles.sinFoto} />
            )}
          </View>
          {type ? (
            <Text
              style={[
                styles.type,
                styles.shadowProp,
                type === 'Donar' ? styles.typeDonation : styles.typeSell,
              ]}
            >
              {mappingType[type]}
            </Text>
          ) : null}

          <View style={[styles.content]}>
            {category ? <Text style={styles.category}>{category}</Text> : null}
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {location ? <Text style={styles.location}>{location}</Text> : null}

            {/* <View style={styles.infoContainer}>
              {!myOffer ? <ProfileLite user={user} /> : null}

              {status ? (
                <Text
                  style={{
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    backgroundColor: status.color_background,
                    color: status.color_text,
                  }}
                >
                  {statusText == 'MyOffer' ? status.nameMyOffer : status.name}
                </Text>
              ) : null}
            </View> */}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

Offer.defaultProps = {};

export default Offer;

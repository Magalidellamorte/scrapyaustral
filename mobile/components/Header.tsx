import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from 'react-query';
import config from '../config/config';
import Layout from '../constants/Layout';
import { useGlobalState } from '../context/GlobalStateContext';
import Title from './Title';

import IconVerified from '../assets/icons/checkWhite.png';
import IconCliente from '../assets/icons/icon_cliente.svg';
import IconScraper from '../assets/icons/icon_scraper.svg';
import logo from '../assets/images/logo.png';

type HeaderProps = {
  rounded?: boolean;
  showProfile?: any;
  profilePicture?: string;
  hideBack?: boolean;
  scraper?: boolean;
  tabStatus?: any;
  title?: any;
  hiddenButtons?: boolean;
  user?: any;
  scraperHandler?: () => void;
  clientHandler?: () => void;
  backTo?: string;
};

const styles = StyleSheet.create({
  safe: {
    zIndex: 1,
    flex: 0,
    backgroundColor: '#49DA8B',
    marginTop:
      // eslint-disable-next-line no-nested-ternary
      Platform.OS === 'android'
        ? Layout.window.width > 390
          ? StatusBar.currentHeight
          : 5
        : 0,
  },
  base: {
    paddingTop: 0,
    margin: 0,
  },
  parentContainer: {
    alignSelf: 'flex-start',
    width: Layout.window.width,
    height:
      Layout.window.width > 390
        ? Layout.window.width / 2.6
        : Layout.window.width / 2.2,
  },
  containerNotRounded: {
    paddingTop: 15,
  },
  container: {
    borderRadius: Layout.window.width,
    width: Layout.window.width * 2,
    height: Layout.window.width * 2,
    marginLeft: -(Layout.window.width / 2),
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
    marginBottom: 0,
    borderColor: 'transparent',
  },
  content: {
    height:
      Layout.window.width > 390
        ? Layout.window.width / 2.6
        : Layout.window.width / 2.2,
    width: Layout.window.width,
    position: 'absolute',
    bottom: 0,
    marginLeft: Layout.window.width / 2,
    backgroundColor: '#49DA8B',
    alignItems: 'center',
    paddingTop: 15,
  },
  logo: {
    height: 45,
    width: 155,
    resizeMode: 'stretch',
  },
  iconVerified: {
    height: 16,
    width: 16,
  },
  pressIconScraper: {
    width: 100,
    right:
      Layout.window.width > 390
        ? Layout.window.width / 5
        : Layout.window.width / 9,
    elevation: 11,
    top: Layout.window.width / 2.7,
    position: 'absolute',
    height: 80,
    zIndex: 80,
  },
  pressIconCliente: {
    width: 100,
    left:
      Layout.window.width > 390
        ? Layout.window.width / 5
        : Layout.window.width / 9,
    top: Layout.window.width / 2.7,
    position: 'absolute',
    height: 80,
    zIndex: 80,
    elevation: 11,
  },
  ViewIconCliente: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 80,
    borderRadius: 100,
    borderWidth: 1,
    width: Platform.OS === 'android' ? Layout.window.width / 4.5 : 85,
    height: Platform.OS === 'android' ? Layout.window.width / 4.5 : 85,
    borderColor: '#efefef',
    backgroundColor: 'white',
    padding: 15,
    alignSelf: 'center',
  },
  textTitle: {
    color: 'white',
    marginTop: 5,
  },
  TextIcon: {
    position: 'absolute',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 55,
    justifyContent: 'center',
    bottom: Layout.window.width > 390 ? -25 : -16,
    fontSize: Layout.window.width > 390 ? 12 : 10,
  },
  ViewIconScraper: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: Platform.OS === 'android' ? Layout.window.width / 4.5 : 85,
    height: Platform.OS === 'android' ? Layout.window.width / 4.5 : 85,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#efefef',
    backgroundColor: 'white',
    padding: 15,
    alignSelf: 'center',
  },

  ActiveCliente: {
    borderWidth: 3,
    borderColor: '#39b76f',
  },

  ActiveScraper: {
    borderColor: '#60d1e1',
    borderWidth: 3,
  },

  containerFlat: {
    height: 80,
    backgroundColor: '#49DA8B',
    alignItems: 'center',
    paddingTop: 20,
  },
  Shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.26,
    elevation: 8,
  },
  imageProfile: {
    marginTop: -40,
    marginBottom: 10,
    overflow: 'visible',
    alignSelf: 'center',
    elevation: 10,
    zIndex: 10,
    borderRadius: 100,
    shadowColor: '#efefef',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 3,
  },
  imageProfileimg: {
    height: 80,
    width: 80,
    resizeMode: 'cover',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
    zIndex: 9,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageProfilechg: {
    height: 30,
    width: 30,
    position: 'absolute',
    resizeMode: 'cover',
    borderRadius: 100,
    backgroundColor: 'white',
    zIndex: 10,
    alignSelf: 'center',
    elevation: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    right: -10,
    bottom: 0,
  },
  iosPadding: {},
});

function Header({
  rounded,
  profilePicture,
  showProfile,
  hideBack,
  title,
  hiddenButtons,
  user,
  tabStatus,
  backTo,
  scraperHandler,
  clientHandler,
}: HeaderProps) {
  const { globalState } = useGlobalState();
  const { countNotifications, token } = globalState;
  const navigation = useNavigation();

  const renderNotificationsButton = (
    <View
      style={[
        {
          position: 'absolute',
          top: rounded ? 20 : 20,
          right: 10,
          backgroundColor: 'transparent',
          width: 40,
        },
      ]}
    >
      <>
        {countNotifications > 0 ? (
          <Text
            style={{
              backgroundColor: 'red',
              position: 'absolute',
              zIndex: 13,
              top: -8,
              left: -6,
              color: 'white',
              borderRadius: 10,
              textAlign: 'center',
              width: 20,
              height: 20,
              fontSize: 10,
              alignContent: 'center',
              alignItems: 'center',
              textAlignVertical: 'center',
            }}
          >
            {countNotifications}
          </Text>
        ) : null}
        <Ionicons
          name="notifications"
          size={28}
          color="#fff"
          onPress={() => navigation.navigate('Notifications')}
        />
      </>
    </View>
  );

  const renderBackButton =
    !hideBack &&
    navigation.getState().type !== 'tab' &&
    navigation.canGoBack() ? (
      <View
        style={{
          position: 'absolute',
          top: rounded ? 20 : 20,
          left: 10,
          height: 40,
          width: 40,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={28}
          color="#fff"
          onPress={() => {
            if (backTo) {
              navigation.navigate(backTo as any);
            } else {
              navigation.goBack();
            }
          }}
        />
      </View>
    ) : null;

  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    'upload-profile-picture',
    (image) => {
      const body = new FormData();
      body.append(`image`, {
        type: 'image/jpeg',
        uri: image.uri,
        name: image.uri.split('/').pop(),
      });

      return axios.post(`${config.BASE_ENDPOINT}/auth/profile-picture`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');

        Toast.show({
          type: 'success',
          text1: '¡Foto de perfíl actualizada!',
          position: 'bottom',
          visibilityTime: 500,
        });
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: '¡No pudimos actualizar tu foto de perfíl!',
          position: 'bottom',
          visibilityTime: 500,
        });
      },
    }
  );

  const pickImage = async () => {
    if (!showProfile) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.3,
      });

      if (!result.canceled) {
        mutate(result.assets[0]);
      }
    }
  };

  if (rounded) {
    return (
      <>
        <SafeAreaView style={styles.safe} />
        <View
          style={[
            styles.base,
            Platform.OS === 'ios' ? styles.iosPadding : null,
          ]}
        >
          <View style={[styles.parentContainer]}>
            <View style={styles.container}>
              <View style={styles.content}>
                {renderBackButton}
                {renderNotificationsButton}

                {title ? (
                  <Title>{title}</Title>
                ) : (
                  <Image source={logo} style={styles.logo} />
                )}

                {user ? (
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '900',
                        color: 'white',
                        fontFamily: 'Montserrat-ExtraBold',
                        fontSize: 17,
                      }}
                    >
                      ¡Hola {user?.data?.first_name}!
                    </Text>
                  </View>
                ) : null}

                {showProfile ? (
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </View>
        {profilePicture && !hiddenButtons && (
          <View style={styles.imageProfile}>
            <Pressable onPress={pickImage}>
              {!showProfile ? (
                <View style={[styles.imageProfilechg, styles.Shadow]}>
                  <FontAwesome name="camera" size={15} color="#444" />
                </View>
              ) : null}

              <Image
                style={styles.imageProfileimg}
                source={{ uri: profilePicture }}
              />
            </Pressable>
            {(showProfile?.first_name && showProfile?.last_name) ||
            showProfile?.company_title ? (
              <Text
                style={{
                  fontWeight: '900',
                  color: '#444',
                  fontFamily: 'Montserrat-ExtraBold',
                  fontSize: 17,
                }}
              >
                {showProfile?.company_title
                  ? showProfile?.company_title
                  : `${showProfile?.first_name} ${showProfile?.last_name} `}
                {showProfile?.verified ? (
                  <>
                    <Image style={styles.iconVerified} source={IconVerified} />
                  </>
                ) : null}
              </Text>
            ) : null}
          </View>
        )}

        {!profilePicture && !hiddenButtons ? (
          <>
            <Pressable onPress={clientHandler} style={styles.pressIconCliente}>
              <View
                style={[
                  styles.ViewIconCliente,
                  styles.Shadow,
                  tabStatus ? null : styles.ActiveCliente,
                ]}
              >
                <IconCliente
                  style={{
                    transform:
                      Layout.window.width > 390
                        ? [{ scale: 1 }]
                        : [{ scale: 0.7 }],
                  }}
                />
                <Text style={styles.TextIcon}>Vender</Text>
              </View>
            </Pressable>
            <Pressable onPress={scraperHandler} style={styles.pressIconScraper}>
              <View
                style={[
                  styles.ViewIconScraper,
                  styles.Shadow,
                  tabStatus ? styles.ActiveScraper : null,
                ]}
              >
                <IconScraper
                  style={{
                    transform:
                      Layout.window.width > 390
                        ? [{ scale: 1 }]
                        : [{ scale: 0.7 }],
                  }}
                />
                <Text style={styles.TextIcon}>Comprar</Text>
              </View>
            </Pressable>
          </>
        ) : null}
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.safe} />
      <View
        style={[
          styles.containerFlat,
          styles.containerNotRounded,
          Platform.OS === 'ios' ? styles.iosPadding : null,
        ]}
      >
        {renderBackButton}
        {renderNotificationsButton}

        {title ? (
          <Title style={styles.textTitle}>{title}</Title>
        ) : (
          <Image source={logo} style={styles.logo} />
        )}
      </View>
    </>
  );
}

Header.defaultProps = {
  hideBack: false,
  rounded: true,
  showProfile: '',
  profilePicture: null,
  scraper: false,
  scraperHandler: () => {},
  clientHandler: () => {},
};

export default Header;

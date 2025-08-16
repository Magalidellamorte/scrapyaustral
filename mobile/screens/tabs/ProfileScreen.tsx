// import * as React , {Fragment} from 'react';
import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
} from 'react-native';

import Button from '../../components/Button';
import Header from '../../components/Header';
import MenuProfile from '../../components/MenuProfile';
import Spacer from '../../components/Spacer';
import { Text, View } from '../../components/Themed';
import config from '../../config/config';
import getProfilePicturePath from '../../helpers/getProfilePicturePath';
import useLogout from '../../services/useLogout';
import useUser from '../../services/useUser';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#49DA8B',
    marginTop: StatusBar.currentHeight,
  },
  container2: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'red',
    marginTop: StatusBar.currentHeight,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  buttons: {
    flex: 1,
    justifyContent: 'space-evenly',
    maxHeight: '55%',
  },
  buttonsRight: {
    flex: 3,
    justifyContent: 'space-evenly',
    maxHeight: '55%',
  },
  text: {
    textAlign: 'center',
    fontSize: 17,
  },
  item: {
    flexDirection: 'row',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 1,
    paddingTop: 0,
    paddingBottom: 10,
    marginTop: 0,
    width: '100%',
  },
  bold: {
    fontWeight: '900',
  },
  itemText: {
    marginTop: 5,
  },
  right: {
    position: 'absolute',
    right: 0,
    marginTop: 4,
  },
});

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { data: user } = useUser();
  const [isDeleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);

  const handleDeleteAccount = () => {};
  const logout = useLogout();

  return (
    <>
      <Header
        rounded
        profilePicture={getProfilePicturePath(user?.data ?? {})}
      />
      <ScrollView>
        <View style={styles.content}>
          <Spacer />

          <Text style={[styles.text, styles.bold]}>
            {`${user?.data?.first_name || ''} ${user?.data?.last_name || ''}`}
          </Text>

          <Spacer size={10} />

          <Pressable
            onPress={() =>
              navigation.navigate('PublicProfile', { userId: user?.data?.id })
            }
            disabled={!user?.data?.id}
          >
            <Text style={styles.text}>Ver mi perfíl</Text>
          </Pressable>

          <Spacer size={30} />

          {/* {!user?.data?.scraper && (
            <Button
              type="secondary"
              style={{ fontWeight: '900', textTransform: 'uppercase' }}
              onPress={() => {
                navigation.navigate('BeScraper');
              }}
              disabled={!user?.data?.id}
            >
              Completar Perfil
            </Button>
          )} */}

          <Spacer size={30} />

          <View style={styles.buttons}>
            <MenuProfile
              onPress={async () => {
                navigation.navigate('EditProfile');
              }}
              icon="user"
              user={user}
            >
              Mis datos
            </MenuProfile>
            {/* <MenuProfile
              onPress={async () => {
                navigation.navigate('BeScraper', { user });
              }}
              icon="user"
              user={user}
            >
              Editar Perfil
            </MenuProfile> */}

            {!user?.data?.verified ? (
              <MenuProfile
                onPress={async () => {
                  navigation.navigate('Validate');
                }}
                icon="checkcircleo"
                user={user}
              >
                Validar cuenta
              </MenuProfile>
            ) : null}

            <MenuProfile
              onPress={async () => {
                navigation.navigate('Support');
              }}
              icon="tool"
              user={user}
            >
              Soporte
            </MenuProfile>

            <MenuProfile
              onPress={async () => {
                await Share.share({
                  message: `Scrapy - Tu aliado en el reciclaje - ${config.SHARE_URL}`,
                });
              }}
              icon="sharealt"
              user={user}
            >
              Compartir app
            </MenuProfile>

            <MenuProfile
              onPress={async () => {
                Linking.openURL(config.TYC_URL);
              }}
              icon="filetext1"
              user={user}
            >
              Términos y Condiciones
            </MenuProfile>

            {Platform.OS === 'ios' && user ? (
              <MenuProfile
                onPress={() => setDeleteAccountModalVisible(true)}
                icon="delete" // Puedes ajustar el icono según tus necesidades
                user={user}
              >
                Eliminar cuenta
              </MenuProfile>
            ) : null}

            <MenuProfile
              onPress={async () =>
                user ? logout.mutate() : navigation.navigate('Initial')
              }
              icon="logout"
              user={user}
            >
              {user ? 'Salir' : 'Salir de la demostración'}
            </MenuProfile>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isDeleteAccountModalVisible}
        >
          {Platform.OS === 'ios' ? (
            <View
              style={{
                height: 55,
                backgroundColor: '#49DA8B',
              }}
            ></View>
          ) : null}
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text>¿Estás seguro de que deseas eliminar tu cuenta?</Text>
              <View
                style={{
                  marginTop: 30,
                  marginBottom: 20,
                }}
              >
                <Button
                  type="primary"
                  onPress={() => {
                    handleDeleteAccount();
                    setDeleteAccountModalVisible(false);
                    logout.mutate();
                  }}
                >
                  Si
                </Button>
              </View>
              <View
                style={{
                  marginBottom: 20,
                }}
              >
                <Button onPress={() => setDeleteAccountModalVisible(false)}>
                  Cancelar
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
}

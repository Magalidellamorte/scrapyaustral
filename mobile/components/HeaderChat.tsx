import * as React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import getProfilePicturePath from '../helpers/getProfilePicturePath';

type HeaderProps = {
  user: Record<string, unknown>;
};

const styles = StyleSheet.create({
  containerFlat: {
    backgroundColor: '#49DA8B',
  },
  container: {
    height: 55,
    flexDirection: 'row',
    paddingLeft: 50,
    paddingRight: 20,
    alignItems: 'center',
  },
  first: {},
  second: {
    paddingHorizontal: 10,
  },
  third: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 3,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '900',
  },
});

function HeaderChat({ user, tabs }: HeaderProps) {
  const navigation = useNavigation();

  const renderBackButton =
    navigation.getState().type !== 'tab' && navigation.canGoBack() ? (
      <View
        style={{
          position: 'absolute',
          top: 13,
          left: 10,
          width: 40,
          zIndex: 1,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={28}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
      </View>
    ) : null;

  return (
    <>
      {renderBackButton}
      <View style={styles.containerFlat}>
        <View style={styles.container}>
          <View style={styles.first}>
            <Image
              source={{ uri: getProfilePicturePath(user ?? {}) }}
              style={{ width: 25, height: 25, borderRadius: 75 }}
            />
          </View>

          <View style={styles.second}>
            <Text style={styles.title}>{user?.full_name}</Text>
          </View>

          <View style={styles.third}>{tabs}</View>
        </View>
      </View>
    </>
  );
}

HeaderChat.defaultProps = {};

export default HeaderChat;

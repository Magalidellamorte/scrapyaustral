import React from 'react';
import { View, StyleSheet, Pressable, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RatingBars from './rating/RatingBars';
import getProfilePicturePath from '../helpers/getProfilePicturePath';

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
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
  profileInfo: {
    marginLeft: 10,
    width: '85%',
  },
});

type ProfileLiteProps = {
  user?: any;
  goToProfile?: boolean;
};

function ProfileLite({ user, goToProfile }: ProfileLiteProps) {
  const profilePicture = getProfilePicturePath(user ?? {});
  const navigation = useNavigation();

  return (
    <>
      <Pressable
        style={styles.infoContainer}
        onPress={() => {
          goToProfile
            ? navigation.navigate('PublicProfile', {
                userId: user?.id,
              })
            : null;
        }}
      >
        {profilePicture ? (
          <View style={styles.profilePictureContainer}>
            <Image
              style={styles.profilePictureImage}
              source={{ uri: profilePicture }}
            />
          </View>
        ) : null}

        {user && (
          <View style={styles.profileInfo}>
            <Text style={{ fontWeight: "900" }}>
              {user?.company_title || user?.full_name}
            </Text>
            <RatingBars
              user={user}
              onlySelectedLite={!goToProfile}
              onlySelected
            />
          </View>
        )}
      </Pressable>
    </>
  );
}

export default ProfileLite;

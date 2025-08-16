import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar } from 'react-native';
import moment from 'moment';

import Header from '../../components/Header';
import Layout from '../../constants/Layout';
import useUserProfile from '../../services/useUserProfile';
import BoldText from '../../components/BoldText';
import UserPosts from '../../components/UserPosts';
import RatingBars from '../../components/rating/RatingBars';
import getProfilePicturePath from '../../helpers/getProfilePicturePath';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: StatusBar.currentHeight,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    minHeight: Layout.window.height - 220,
  },
  invoiceContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  noRatingText: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
});
export default function PublicProfileScreen({ navigation, route }) {
  const { data: user } = useUserProfile(route.params.userId);

  return (
    <>
      <Header
        profilePicture={getProfilePicturePath(user?.data ?? {})}
        rounded
        showProfile={user?.data}
      />
      <ScrollView>
        <View style={styles.container}>
          {user?.data ? (
            <>
              {user?.data?.description ? (
                <>
                  <View
                    style={{
                      borderRadius: 10,
                      backgroundColor: '#f5f5f5',
                      padding: 20,
                      marginBottom: 20,
                    }}
                  >
                    <BoldText
                      style={{
                        fontSize: 16,
                        textAlign: 'center',
                      }}
                    >
                      {user?.data?.description}
                    </BoldText>
                  </View>
                </>
              ) : null}
              <Text style={{ fontSize: 20, fontWeight: '600' }}>Opiniones</Text>

              {/* <Text>
                <BoldText>Ubicación:</BoldText>{' '}
              </Text>
              <Text>
                <BoldText>Horarios:</BoldText>{' '}
              </Text> */}

              {/* <Text>
                <BoldText>Miembro desde:</BoldText>{' '}
                {moment(user?.data?.creatd_at).format('DD/MM/YYYY')}
              </Text> */}
              {/* {user?.data?.scraper ? (
            <Text>
              <BoldText>Scraper desde:</BoldText>{' '}
              {moment(user?.data?.subscriptions[0].starts_at).format(
                'DD/MM/YYYY'
              )}
            </Text>
          ) : null} */}
              <RatingBars user={user} withComments />
              <UserPosts user={user} />
            </>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}

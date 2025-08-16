import * as React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import useUser from '../services/useUser';
import ChatItem from './ChatItem';
import getProfilePicturePath from '../helpers/getProfilePicturePath';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});

const ChatList = ({ chats }) => {
  const navigation = useNavigation();
  const { data: loggedUser } = useUser();

  return (
    <View style={styles.container}>
      {chats.map(
        ({
          id,
          receiver_id,
          text,
          created_at,
          unread_count,
          receiver,
          sender,
          offer,
          offer_id,
        }) => {
          const user = loggedUser?.data?.id === receiver_id ? sender : receiver;

          return (
            <Pressable
              key={id}
              onPress={() =>
                navigation.navigate('ChatInternal', {
                  toUser: user,
                  offerId: offer_id,
                })
              }
            >
              <ChatItem
                offer={offer}
                name={user?.full_name}
                message={text + new Array(100).fill(' ').join('')}
                time={moment(created_at).format('HH:mm')}
                image={getProfilePicturePath(user ?? {}, '00e383', 'ffffff')}
                unread={unread_count}
              />
            </Pressable>
          );
        }
      )}
    </View>
  );
};

export default ChatList;

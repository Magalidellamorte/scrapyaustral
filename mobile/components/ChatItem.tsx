import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import cn from 'react-native-classnames';
import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '900',
  },
  message: {
    fontSize: 14,
    color: 'rgba(0,0,0,.6)',
  },
  messageUnread: {
    fontWeight: '900',
  },
  container: {
    height: 75,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    width: Layout.window.width,
    margin: 0,
  },
  unread: {
    backgroundColor: '#e7fff5',
  },
  first: {
    flex: Layout.window.width > 330 ? 0.4 : 0.6,
  },
  second: {
    flex: 2,
    paddingHorizontal: 15,
    maxWidth: Layout.window.width - 110,
  },
  third: {
    alignContent: 'flex-end',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',

    flex: 0.6,
  },
  unreadCount: {
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: '#49DA8B',
    color: 'white',
  },
});

const ChatItem = ({ name, message, time, image, offer, unread }) => (
  <View
    style={cn(styles, 'container', {
      unread: unread > 0,
    })}
  >
    <View style={styles.first}>
      <Image
        source={{ uri: image }}
        style={{ width: 55, height: 55, borderRadius: 75 }}
      />
    </View>

    <View style={styles.second}>
      <Text style={styles.text}>
        {offer.title} <Text style={{ fontWeight: 'normal' }}> - {name}</Text>
      </Text>
      <View>
        <Text
          style={cn(styles, 'message', {
            messageUnread: unread > 0,
          })}
          numberOfLines={1}
        >
          {message}
        </Text>
      </View>
    </View>

    <View style={styles.third}>
      <Text style={{ color: 'rgba(0,0,0,.4)' }}>{time}</Text>
      {unread > 0 && <Text style={styles.unreadCount}>{unread}</Text>}
    </View>
  </View>
);

export default ChatItem;

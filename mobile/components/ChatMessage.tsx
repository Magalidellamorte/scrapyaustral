import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import get from 'lodash/get';
import moment from 'moment';

import useUser from '../services/useUser';

type ChatMessageProps = {
  message: Record<string, unknown>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e1e1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 10,
    width: '75%',
  },
  text: {},
  time: {},
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f1f1f1',
  },
});

function ChatMessage({ message }: ChatMessageProps) {
  const { data } = useUser();
  const user = get(data, 'data', {});

  return (
    <View
      style={[
        styles.container,
        message.sender_id === user?.id && styles.ownMessage,
      ]}
    >
      <Text style={styles.text}>{message.text}</Text>
      <Text style={styles.text}>
        {moment(message.created_at).format('D/M/Y H:mm')}
      </Text>
    </View>
  );
}

export default ChatMessage;

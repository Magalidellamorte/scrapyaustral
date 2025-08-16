import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import get from 'lodash/get';

type ErrorMessageProps = {
  message?: string | boolean;
  error?: any;
  alert?: boolean;
};

const styles = StyleSheet.create({
  messageText: {
    fontSize: 9,
    color: '#f00',
    position: 'relative',
    textTransform: 'uppercase',
    top: -8,
    left: 10,
    textAlign: 'left',
  },
});

function ErrorMessage({ message, error, alert }: ErrorMessageProps) {
  const errors = get(error, 'response.data.errors', {});
  const mappedErrors = Object.keys(errors).map((key) => errors[key][0]);

  if (mappedErrors.length) {
    return <Text style={styles.messageText}>{mappedErrors.join('.')}</Text>;
  }

  return message ? <Text style={styles.messageText}>{message}</Text> : null;
}

ErrorMessage.defaultProps = {
  message: '',
  error: null,
  alert: false,
};

export default ErrorMessage;

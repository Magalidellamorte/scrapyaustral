import * as React from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { useQueryClient } from 'react-query';
import Toast from 'react-native-toast-message';

import useSubmitRating from '../services/useSubmitRating';
import SetRating from './rating/SetRating';
import Button from './Button';
import Spacer from './Spacer';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderRadius: 10,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginVertical: 10,
    textAlignVertical: 'top',
    paddingVertical: 15,
  },
});

function PendingRating({ rating }) {
  const [currentRating, setCurrentRating] = React.useState(0);
  const [message, setMessage] = React.useState('');
  const queryClient = useQueryClient();
  const submitRating = useSubmitRating(rating?.id);

  const handleRatingSubmit = () => {
    submitRating.mutate(
      { rating: currentRating, message },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['offer', rating?.offer_id]);

          Toast.show({
            type: 'success',
            text1: '¡La calificación se ha enviado correctamente!',
            position: 'bottom',
            visibilityTime: 500,
          });
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1:
              error?.response?.data?.message ??
              'Error al realizar calificación',
            position: 'bottom',
            visibilityTime: 1000,
          });
        },
      }
    );
  };

  const userToRate =
    rating.user_id === rating.scraper_id ? rating.client : rating.scraper;

  return (
    <View style={styles.container}>
      <Text>Calificar a {userToRate.full_name}:</Text>

      <Spacer />
      <SetRating onFinishRating={setCurrentRating} />
      <Spacer />

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={5}
        onChangeText={(value) => setMessage(value)}
        value={message}
        placeholder="Dejanos un mensaje contando tu experiencia"
        placeholderTextColor="#ccc"
      />

      <Button
        type="primary"
        disabled={submitRating.isLoading || !currentRating}
        onPress={handleRatingSubmit}
      >
        Calificar
      </Button>
    </View>
  );
}

export default PendingRating;

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import RatingImg from './rating/RatingImg';
import BoldText from './BoldText';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  left: {
    alignContent: 'flex-start',
    flex: 0.5,
  },
  right: {
    flex: 0.5,
    alignContent: 'flex-end',
    textAlign: 'right',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  message: {
    fontSize: 13,
  },
});

function Rating({ rating }: { rating: any }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Text>{moment(rating.created_at).format('DD/MM/YYYY')}</Text>
        </View>
        <View style={styles.right}>
          <RatingImg
            style={{ width: 30, height: 30 }}
            id={parseInt(rating.rating, 10)}
          />
        </View>
      </View>

      <View style={styles.message}>
        <BoldText>
          {rating.message
            ? rating.message
            : `Se ha calificado ${
                rating.rating === '1.00'
                  ? 'Excelente'
                  : rating.rating === '2.00'
                  ? 'Regular'
                  : 'Malo'
              }`}
        </BoldText>
      </View>
    </View>
  );
}

export default Rating;

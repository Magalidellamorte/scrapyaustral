import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import RatingImg from './RatingImg';

const styles = StyleSheet.create({
  general: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  selected: {
    borderColor: '#49DA8B',
    borderWidth: 1,
  },
});

function SetRating({ onFinishRating }) {
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    if (checked) {
      onFinishRating(checked);
    }
  }, [checked]);

  return (
    <>
      <View style={styles.general}>
        <Pressable
          onPress={() => {
            setChecked(1);
          }}
          style={[styles.item, checked === 1 && styles.selected]}
        >
          <RatingImg id={1} />
          <Text>Excelente</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setChecked(2);
          }}
          style={[styles.item, checked === 2 && styles.selected]}
        >
          <RatingImg id={2} />
          <Text>Regular</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setChecked(3);
          }}
          style={[styles.item, checked === 3 && styles.selected]}
        >
          <RatingImg id={3} />
          <Text>Mala</Text>
        </Pressable>
      </View>
    </>
  );
}

SetRating.defaultProps = {};

export default SetRating;

import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  ratingGeneral2: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ratingGeneral: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ratingGrey: {
    backgroundColor: '#eee',
    borderRadius: 20,
    height: 25,
    flex: 0.9,
  },
  ratingGreen: {
    backgroundColor: '#49DA8B',
    height: 25,
    alignItems: 'center',
    borderRadius: 20,
  },
  ratingText: { flex: 0.3, marginLeft: 10 },
});
type RatingBarProps = {
  cantidad?: number;
  total?: number;
  label?: string;
  id?: number;
  idSelected?: number;
  onlyLabel?: boolean;
  showMatch?: boolean;
};

function RatingBar({
  cantidad,
  total,
  label,
  id,
  idSelected,
  onlyLabel,
  showMatch,
}: RatingBarProps) {
  return showMatch && id !== idSelected ? (
    <></>
  ) : (
    <>
      <View style={[onlyLabel ? styles.ratingGeneral2 : styles.ratingGeneral]}>
        {!onlyLabel ? (
          <View style={[styles.ratingGrey, showMatch && { flex: 1 }]}>
            <View
              style={[
                styles.ratingGreen,
                {
                  width: cantidad && total ? `${(cantidad * 100) / total}%` : 0,
                },
              ]}
            >
              <Text />
            </View>
          </View>
        ) : null}

        <View style={[styles.ratingText, showMatch && { flex: 0.6 }]}>
          <Text
            style={[
              {
                fontWeight: id === idSelected && !showMatch ? 'bold' : 'normal',
              },
            ]}
          >
            {label}
            {!showMatch && `(${cantidad})`}
          </Text>
        </View>
      </View>
    </>
  );
}

RatingBar.defaultProps = {
  cantidad: 0,
  total: 0,
  label: '',
  showMatch: 0,
  onlyLabel: false,
  id: 0,
  idSelected: 0,
};

export default RatingBar;

import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SectionTitleProps = {
  icon: 'calendar' | 'clock-o' | 'truck' | 'gift' | 'map-marker';
  title: string;
  subtitle: string;
  inverted?: boolean;
};

const styles = StyleSheet.create({
  titleContainer: { flexDirection: 'row', alignItems: 'center', height: 35 },
  icon: {
    width: 30,
    textAlign: 'center',
    color: '#686868',
  },
  iconTruck: {
    width: 30,
    textAlign: 'center',
    transform: [{ rotateY: '180deg' }],
    color: '#686868',
  },
  title: {
    marginLeft: 10,
    color: '#686868',
    fontSize: 16,
    fontWeight: '900',
  },
  subtitle: {
    color: '#686868',
    fontSize: 14,
  },
});

function SectionTitle({ icon, title, subtitle, inverted }: SectionTitleProps) {
  return (
    <View>
      <View style={styles.titleContainer}>
        <FontAwesome
          style={icon === 'truck' ? styles.iconTruck : styles.icon}
          size={24}
          name={icon}
        />

        <Text style={!inverted ? styles.title : styles.subtitle}>{title}</Text>
      </View>

      <Text style={!inverted ? styles.subtitle : styles.title}>{subtitle}</Text>
    </View>
  );
}

SectionTitle.defaultProps = {
  inverted: false,
};

export default SectionTitle;

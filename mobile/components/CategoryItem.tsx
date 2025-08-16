import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import Layout from '../constants/Layout';
import CategoryImage from './CategoryImage';

type CategoryItemProps = {
  value: unknown;
  onPress: () => void;
  selected: boolean;
  label: string;
  size?: number;
};

function CategoryItem({
  size,
  value,
  onPress,
  selected,
  label,
}: CategoryItemProps) {
  return (
    <Pressable key={value} onPress={(event) => onPress(value, selected, event)}>
      <View
        style={{
          marginBottom: 20,
          padding: Layout.window.width / (6 * 9),
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: selected ? '#e2fef1' : '#f7f7f7',
            borderWidth: 0,
            borderRadius: 50,
            shadowColor: selected ? '#39ce67' : '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: selected ? 0.4 : 0.1,
            shadowRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CategoryImage value={value} style={{ width: 45, height: 40 }} />
        </View>
        <Text
          style={{
            fontSize: 12,
            marginTop: 5,
            textAlign: 'center',
            width: size,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

CategoryItem.defaultProps = {
  size: 60,
};

export default CategoryItem;

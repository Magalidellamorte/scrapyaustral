import { whileStatement } from '@babel/types';
import * as React from 'react';
import {
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  View,
  StyleSheet,
} from 'react-native';
import Layout from '../constants/Layout';

type CategoriesSliderProps = {
  orientation?: 'horizontal' | 'vertical';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    margin: 4,
    color: 'white',
    width: Layout.window.width,
    height: 80,
  },
  title: {
    fontSize: 16,
  },
  image: {},
  categories: {
    height: 220,
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
});

const Category = ({ name }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{name}</Text>
  </View>
);

function CategoriesSlider({ orientation }: CategoriesSliderProps) {
  const categories = [
    { id: 1, name: 'Cartón', image: '' },
    { id: 2, name: 'Metales', image: '' },
    { id: 3, name: 'Plástico', image: '' },
    { id: 4, name: 'Madera', image: '' },
    { id: 5, name: 'Cables', image: '' },
    { id: 6, name: 'Electrónicos', image: '' },
    { id: 7, name: 'Textiles', image: '' },
    { id: 8, name: 'Maquinaria', image: '' },
  ];

  const renderItem = ({ name, image }) => (
    <Category name={name} image={image} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView style={styles.categories} horizontal>
        <View>
          {categories.map(({ id, name, image }) => (
            <Category key={id} name={name} image={image} />
          ))}
        </View>
        <View>
          {categories.map(({ id, name, image }) => (
            <Category key={id} name={name} image={image} />
          ))}
        </View>
      </ScrollView> */}
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={4}
      />
    </SafeAreaView>
  );
}

CategoriesSlider.defaultProps = {
  orientation: 'horizontal',
};

export default CategoriesSlider;

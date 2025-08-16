import * as React from 'react';
import { StyleSheet, View, Text,
  ScrollView,
 } from 'react-native';
import { RootStackScreenProps } from '../types';
import Button from '../components/Button';
import Layout from '../constants/Layout';
import Spacer from '../components/Spacer';
import Header from '../components/Header';

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default function FinishScreen({  navigation }) {
  return (
    <>
      <Header hideBack rounded={false}  />
      <ScrollView>
        <View style={{marginTop:100}}>
          <Text style={{fontWeight:'bold',fontSize:20,textAlign:'center'}}>¡Ya sos un Comprador!</Text>
          <Text style={{marginTop:20,fontSize:18,textAlign:'center'}}>A partir de este momento tenes 7 dias de prueba gratuitos.</Text>
        </View>
        <View style={{marginTop:100,width:'100%',alignContent:'center',alignItems:'center'}} >
          <Button type="secondary" style={{paddingHorizontal:50}} onPress={() => { navigation.navigate('Home'); }} >Finalizar</Button>
        </View>
      </ScrollView>
    </>
  );
}

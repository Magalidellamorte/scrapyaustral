import * as React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import IconPic from '../assets/images/icon.png';
import Button from '../components/Button';
import Header from '../components/Header';
import Spacer from '../components/Spacer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default function NewScrapScreen({ navigation }) {
  return (
    <>
      <Header title="Publicar scrap" backTo="OwnOffers" rounded={false} />
      <ScrollView>
        <View style={styles.content}>
          <Spacer size={160} />

          <Text style={{ textAlign: 'center', fontSize: 24 }}>
            ¡Todo listo!
          </Text>
          <Text style={{ textAlign: 'center' }}>
            Te avisaremos cuando un recolector tome tu solicitud.
          </Text>

          <Spacer size={60} />
          <Image
            style={{
              width: 210,
              marginHorizontal: 'auto',
              height: 200,
              objectFit: 'fill',
            }}
            source={IconPic}
          />

          <Spacer size={60} />
          <Button type="secondary" onPress={() => navigation.navigate('Home')}>
            Volver al inicio
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

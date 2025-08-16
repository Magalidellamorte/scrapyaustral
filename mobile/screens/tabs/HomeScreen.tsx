import * as React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';

import Header from '../../components/Header';
import { View } from '../../components/Themed';
import useUser from '../../services/useUser';

import ClientHome from '../../components/ClientHome';
import HogarHome from '../../components/HogarHome';
import ScraperHome from '../../components/ScraperHome';
import TorkyHome from '../../components/TorkyHome';
import Layout from '../../constants/Layout';
import useToggle from '../../hooks/useToggle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 130,
    minHeight: Layout.window.height - StatusBar.currentHeight - 225,
  },
});

export default function HomeScreen() {
  const { data: user } = useUser();

  const [tabStatus, toggleTabStatus] = useToggle(false);

  const clientPressHandler = () => {
    if (tabStatus) {
      toggleTabStatus();
    }
  };

  const scraperPressHandler = () => {
    if (!tabStatus) {
      toggleTabStatus();
    }
  };

  if (!user) return null;

  if (user?.data?.type === 'torky') return <TorkyHome />;
  if (user?.data?.type === 'hogar')
    return (
      <ScrollView>
        <Header rounded user={user} hiddenButtons tabStatus={tabStatus} />
        <View style={styles.content}>
          <HogarHome />
        </View>
      </ScrollView>
    );

  return (
    <>
      <ScrollView>
        <Header
          rounded
          scraper={user?.data?.scraper}
          user={user}
          scraperHandler={scraperPressHandler}
          clientHandler={clientPressHandler}
          tabStatus={tabStatus}
        />

        <View style={styles.content}>
          {tabStatus ? <ScraperHome /> : <ClientHome />}
        </View>
      </ScrollView>
    </>
  );
}

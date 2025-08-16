import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Image,
  RefreshControl,
  Pressable,
} from 'react-native';
import get from 'lodash/get';
import axios from 'axios';
import config from '../config/config';
import Header from '../components/Header';
import Title from '../components/Title';
import Spacer from '../components/Spacer';
import Layout from '../constants/Layout';
import { useGlobalState } from '../context/GlobalStateContext';
import useNotifications from '../services/useNotifications';
import NotificationsImg from '../assets/icons/notifications.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    height: Layout.window.height - 80,
  },
  notificationContainer: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
  },
});

export default function NotificationsScreen({ navigation }) {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const readAll = () => axios.post(`${config.BASE_ENDPOINT}/notifications/read_all`, [], {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })
  const notificationsCall = useNotifications();
  const notifications = get(notificationsCall, 'data.data', []);
  const onRefresh = () => {
    notificationsCall.refetch();
    readAll();
  };
  React.useEffect(() => {
    readAll()
  },[])

  return (
    <>
      <Header title="Notificaciones" rounded={false} />
      <View style={styles.content}>
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={
                notificationsCall.isLoading || notificationsCall.isRefetching
              }
            />
          }
        >
          {notifications.length > 0 ? (
            notifications.map((notification:any) => (
              <Pressable key={notification.id}  onPress={()=>{ 
                if(notification.goTo) navigation.navigate(notification.goTo, JSON.parse(notification.goToParams))
              }}>
                <View style={styles.notificationContainer}>
                  <Title style={{fontSize:15,marginBottom:0}}>{notification.title}</Title>
                  <Spacer size={10} />
                  <Text style={{fontSize:16,marginBottom:0}}>{notification.message}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View  style={{marginTop:60}}>
                 <Image
                  source={NotificationsImg}
                  style={{
                    height: 100,
                    flex: 1,
                    resizeMode: 'contain',
                    width: null,
                  }}
                />
              <Text style={{textAlign:'center',marginTop:20,fontSize:15}}>Aún no tienes notificaciones</Text>
            
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

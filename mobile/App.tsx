import { useFonts } from '@expo-google-fonts/inter';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import io from 'socket.io-client';
import LoadingQueries from './components/LoadingQueries';
import config from './config/config';
import { GlobalStateProvider } from './context/GlobalStateContext';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import useStoredState from './hooks/useStoredState';
import Navigation from './navigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 15000,
      retry: false,
    },
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }

  return token;
}

export default function App() {
  const [backgroundColor, setBackgroundColor] = React.useState('#FFF');
  const [fontsLoaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat.ttf'),
    'Montserrat-ExtraBold': require('./assets/fonts/Montserrat-ExtraBold.ttf'),
  });

  const [socket, setSocket] = React.useState(null);
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const [countNotifications, setCountNotifications] = React.useState(0);
  const [menuActive] = React.useState(true);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [tokenChecked, setTokenChecked] = React.useState(false);
  const [{ value: token }, setToken, h] = useStoredState('token', {
    value: null,
  });

  const loadNotifications = () => {
    axios
      .get(`${config.BASE_ENDPOINT}/notifications/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setCountNotifications(response?.data?.count || 0);

        setTimeout(() => {
          loadNotifications();
        }, 3000);
      })
      .catch((err) => {
        console.log('err22', err);
      });
  };

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((expoToken) => {
      console.log('expoToken', expoToken);
      if (expoToken) setExpoPushToken(expoToken);
    });
    notificationListener.current =
      Notifications.addNotificationReceivedListener((expoNotification) => {
        if (expoNotification) setNotification(expoNotification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    const s = io(config.SOCKET_ENDPOINT);
    console.log('s', config.SOCKET_ENDPOINT);

    s.on('connect', () => {
      console.log('Conectado al socket:', s.id);
    });

    s.on('connect_error', (error) => {
      console.error('Error de conexión al socket:', error);
    });

    s.on('disconnect', (reason) => {
      console.log('Desconectado del socket:', reason);
    });

    setSocket(s);

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      s.off();
    };
  }, []);

  React.useEffect(() => {
    async function validateToken() {
      if (h) {
        if (token) {
          try {
            await axios.get(`${config.BASE_ENDPOINT}/auth/user`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          } catch (error) {
            setToken({ value: null });
            setBackgroundColor('#FFF');
          } finally {
            setTokenChecked(true);
            setBackgroundColor('#49DA8B');
          }
        } else {
          setBackgroundColor('#FFF');
          setTokenChecked(true);
        }
      }
    }

    validateToken().then((r) => r);
  }, [token]);

  React.useEffect(() => {
    if (token && expoPushToken && tokenChecked) {
      const body = new FormData();
      body.append('player_id', expoPushToken);

      axios.post(`${config.BASE_ENDPOINT}/expoTokenPush`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadNotifications();
    }
  }, [token, expoPushToken, tokenChecked]);

  if (!isLoadingComplete && !tokenChecked) return null;

  return (
    <GlobalStateProvider
      initialState={{
        expoPushToken,
        loggedIn: !!token,
        token,
        countNotifications,
        menuActive,
        socket,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar backgroundColor={backgroundColor} />
          <LoadingQueries />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GlobalStateProvider>
  );
}

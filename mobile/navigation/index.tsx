import { AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Platform, StatusBar, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Layout from '../constants/Layout';
import { useGlobalState } from '../context/GlobalStateContext';
import ChatInternalScreen from '../screens/ChatInternalScreen';
import FinishScreen from '../screens/FinishScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import InitialScreen from '../screens/InitialScreen';
import LogInScreen from '../screens/LogInScreen';
import MakePostulationScreen from '../screens/MakePostulationScreen';
import ModalScreen from '../screens/ModalScreen';
import ViewTorkyScreenScreen from '../screens/ViewTorkyScreenScreen';

import NewScrapFourHogarScreen from '../screens/hogar/NewScrapFourScreeen';
import NewScrapHogarScreen from '../screens/hogar/NewScrapScreeen';
import NewScrapSecondHogarScreen from '../screens/hogar/NewScrapSecondScreeen';
import NewScrapThirdHogarScreen from '../screens/hogar/NewScrapThirdScreeen';

import NewScrapFourScreen from '../screens/NewScrapFourScreeen';
import NewScrapScreen from '../screens/NewScrapScreeen';
import NewScrapSecondScreen from '../screens/NewScrapSecondScreeen';
import NewScrapThirdScreen from '../screens/NewScrapThirdScreeen';
import NotFoundScreen from '../screens/NotFoundScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import OfferListScreen from '../screens/OfferListScreen';
import BeScraperScreen from '../screens/profile/BeScraperScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import PaymentHistoryScreen from '../screens/profile/PaymentHistoryScreen';
import PublicProfileScreen from '../screens/profile/PublicProfileScreen';
import SelectPlanScreen from '../screens/profile/SelectPlanScreen';
import SupportScreen from '../screens/profile/SupportScreen';
import ValidateScreen from '../screens/profile/ValidateScreen';
import SignUpScreen from '../screens/SignUpScreen';
import {
  ChatScreen,
  HomeScreen,
  OffersScreen,
  PostulationsTorkyScreen,
  ProfileScreen,
} from '../screens/tabs';
import ThanksScreen from '../screens/ThanksScreen';
import ViewOwnOfferScreen from '../screens/ViewOwnOfferScreen';
import ViewOwnOfferTorkyScreen from '../screens/ViewOwnOfferTorkyScreen';
import ViewPostulationScreen from '../screens/ViewPostulationScreen';
import useUser from '../services/useUser';
import { RootStackParamList, RootTabParamList, Tabs } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
const MyTheme = {
  colors: {
    background: 'white',
  },
};

function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return (
    <SimpleLineIcons
      size={30}
      style={{ marginBottom: -3 }}
      name={name}
      color={color}
    />
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const { globalState } = useGlobalState();
  const { menuActive } = globalState;
  const { data: user } = useUser();

  return (
    <BottomTab.Navigator
      initialRouteName={Tabs.HOME}
      screenOptions={{
        headerShown: false,
        indicatorStyle: {
          width: 0,
          height: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <View
            style={{
              backgroundColor: 'white',
              height: 80,
              borderTopEndRadius: 25,
              borderTopStartRadius: 25,
              borderBottomEndRadius: 25,
              borderBottomStartRadius: 25,
              // width: Layout.window.width - 30,
              width: Layout.window.width - 40,
              paddingHorizontal: 50,
              position: 'relative',
              left: 20,
              bottom: 15,
              // shadowOffset: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
            }}
          />
        ),
        tabBarActiveTintColor: '#49DA8B',
        tabBarStyle: {
          position: 'absolute',
          display: menuActive ? 'flex' : 'none',
          borderTopWidth: 0,
          elevation: 0, // for Android
          shadowOffset: {
            width: 0,
            height: 0, // for iOS
          },
          bottom: 30,
          borderTopEndRadius: 25,
          borderTopStartRadius: 25,
          borderBottomEndRadius: 10,
          borderBottomStartRadius: 10,
          paddingHorizontal: 20,
        },
      }}
    >
      <BottomTab.Screen
        name={Tabs.PROFILE}
        component={ProfileScreen}
        options={() => ({
          title: 'Perfíl',
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={26} color={color} />
          ),
        })}
      />
      {/* comentado por cambio de esquema */}
      {/* <BottomTab.Screen
        name={Tabs.CHAT}
        component={ChatScreen}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="speech"
              style={{ display: 'none' }}
              color={color}
            />
          ),
        }}
      /> */}
      <BottomTab.Screen
        name={Tabs.HOME}
        key={Date.now()}
        component={HomeScreen}
        options={{
          title: '',
          tabBarIcon: () => (
            <AntDesign
              name="home"
              size={30}
              color="white"
              style={{ marginTop: 12 }}
            />
          ),
          tabBarItemStyle: {
            position: 'relative',
            top: Layout.window.width > 390 ? -35 : -25,
            backgroundColor: '#49DA8B',
            borderRadius: 75,
            width: 55,
            flex: 0.6,
            height: Layout.window.width > 390 ? 75 : 55,
          },
        }}
      />
      {/* comentado por cambio de esquema */}
      {/* <BottomTab.Screen
        name={Tabs.APPLICATIONS}
        component={ApplicationsScreen}
        options={{
          title: 'Postulaciones',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="magic-wand" color={color} />
          ),
        }}
      /> */}

      {user?.data?.type === 'torky' ? (
        <BottomTab.Screen
          name={Tabs.OWN_OFFERS}
          component={PostulationsTorkyScreen}
          key={Date.now()}
          options={{
            title: 'Postulaciones',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="directions" color={color} />
            ),
          }}
        />
      ) : (
        <BottomTab.Screen
          name={Tabs.OWN_OFFERS}
          component={OffersScreen}
          options={{
            title: 'Anuncios',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="book-open" color={color} />
            ),
          }}
        />
      )}
    </BottomTab.Navigator>
  );
}

function RootNavigator() {
  // @ts-ignore
  const { globalState } = useGlobalState();
  const isLoggedIn = !!globalState.loggedIn;

  React.useEffect(() => {
    if (!isLoggedIn) {
      StatusBar.setBarStyle('dark-content', true);
      if (Platform.OS !== 'ios') StatusBar.setBackgroundColor('#ffffff');
    } else {
      StatusBar.setBarStyle('light-content', true);
      if (Platform.OS !== 'ios') StatusBar.setBackgroundColor('#49DA8B');
    }
  }, [isLoggedIn, []]);

  return (
    <Stack.Navigator>
      {!isLoggedIn && (
        <>
          <Stack.Screen
            name="Initial"
            component={InitialScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LogIn"
            component={LogInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <>
        <Stack.Screen
          name="Thanks"
          component={ThanksScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewScrap"
          component={NewScrapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewScrapHogar"
          component={NewScrapHogarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Finish"
          component={FinishScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MakePostulation"
          component={MakePostulationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewScrapSecondHogar"
          component={NewScrapSecondHogarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewScrapThirdHogar"
          component={NewScrapThirdHogarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewScrapFourHogar"
          component={NewScrapFourHogarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewScrapSecond"
          component={NewScrapSecondScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewScrapThird"
          component={NewScrapThirdScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewScrapFour"
          component={NewScrapFourScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewOwnOffer"
          component={ViewOwnOfferScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewOwnOfferTorky"
          component={ViewOwnOfferTorkyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewPostulation"
          component={ViewPostulationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Support"
          component={SupportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BeScraper"
          component={BeScraperScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Validate"
          component={ValidateScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentHistory"
          component={PaymentHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectPlan"
          component={SelectPlanScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PublicProfile"
          component={PublicProfileScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ViewTorkyScreen"
          component={ViewTorkyScreenScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatInternal"
          component={ChatInternalScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OfferList"
          component={OfferListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
      </>
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
      {isLoggedIn && <></>}
    </Stack.Navigator>
  );
}

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={MyTheme}
      // theme={colorScheme === 'dark' ? DarkTheme : MyTheme}
    >
      <RootNavigator />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}

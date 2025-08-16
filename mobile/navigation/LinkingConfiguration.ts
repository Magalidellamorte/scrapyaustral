/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList, Tabs } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
 prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Initial: 'initial',
      LogIn: 'login',
      SignUp: 'signup',
      ForgotPassword: 'forgot-password',
      NewScrap: 'new-scrap',
      NewScrapSecond: 'new-scrap-second',
      NewScrapThird: 'new-scrap-third',
      ViewOwnOffer: 'view-offer/:id',
      ViewPostulation: 'view-postulation/:id',
      MakePostulation: 'make-postulation/:id',
      Support: 'support',
      EditProfile: 'edit-profile',
      BeScraper: 'be-scraper',
      SelectPlan: 'select-plan',
      PaymentHistory: 'payment-history',
      Notifications: 'notifications',
      PublicProfile: 'public-profile/:id',
      Finish: 'finish-screen',
      ChatInternal: 'chat/:id',
      OfferList: 'offer-list',
      Root: {
        screens: {
          [Tabs.PROFILE]: {
            screens: {
              ProfileScreen: 'profile',
            },
          },
          [Tabs.CHAT]: {
            screens: {
              ChatScreen: 'chat',
            },
          },
          [Tabs.HOME]: {
            screens: {
              HomeScreen: 'home',
            },
          },
          [Tabs.APPLICATIONS]: {
            screens: {
              ApplicationsScreen: 'applications',
            },
          },
          [Tabs.OWN_OFFERS]: {
            screens: {
              OffersScreen: 'offers',
            },
          },
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;

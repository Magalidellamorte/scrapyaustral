/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  // Unauthenticated
  Initial: undefined;
  LogIn: undefined;
  SignUp: undefined;
  NewScrap: undefined;
  NewScrapSecond: undefined;
  NewScrapThird: undefined;
  Support: undefined;
  EditProfile: undefined;
  BeScraper: undefined;
  ViewOwnOffer: undefined;
  MakePostulation: undefined;
  ViewPostulation: undefined;
  ForgotPassword: undefined;
  PaymentHistory: undefined;
  PublicProfile: undefined;
  Notifications: undefined;

  // Authenticated
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export enum Tabs {
  HOME = 'Home',
  PROFILE = 'Profile',
  CHAT = 'Chat',
  APPLICATIONS = 'Applications',
  OWN_OFFERS = 'OwnOffers',
}

export type RootTabParamList = {
  [Tabs.HOME]: undefined;
  [Tabs.PROFILE]: undefined;
  [Tabs.CHAT]: undefined;
  [Tabs.APPLICATIONS]: undefined;
  [Tabs.OWN_OFFERS]: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

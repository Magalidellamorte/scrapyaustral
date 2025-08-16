import { useMutation, useQueryClient } from 'react-query';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useLogout = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { token } = globalState;
  const params = useMutation(
    'logout',
    () =>
      axios.get(`${config.BASE_ENDPOINT}/auth/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: () => {
        setGlobalState({
          token: null,
          loggedIn: false,
        });
        queryClient.invalidateQueries();
        navigation.navigate('Initial');
      },
      onError: () => {
        setGlobalState({
          token: null,
          loggedIn: false,
        });
        queryClient.invalidateQueries();
        navigation.navigate('Initial');
      },
    }
  );
  return params;
};

export default useLogout;

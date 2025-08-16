import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import useStoredState from '../hooks/useStoredState';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useLogin = () => {
  const [{ value: token }, setToken] = useStoredState('token', { value: null });
  const { setGlobalState } = useGlobalState();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    'login',
    (data) =>{
      const body = new FormData();
      body.append('email', data.email);
      body.append('password', data.password);

      return axios.post(`${config.BASE_ENDPOINT}/auth/login`, body)
    }
    ,
    {
      onSuccess: async (response) => {

        setToken({ value: response.data.access_token });
        setGlobalState({ loggedIn: true, token: response.data.access_token });
        
      },
      onError: (err) => {
        console.log('err', err);
      },
    }
  );

  return mutation;
};

export default useLogin;

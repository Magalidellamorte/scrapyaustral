import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useUser = () => {
  const { globalState: {token} } = useGlobalState();
 
  return  useQuery(
    'user',
    () =>
      axios.get(`${config.BASE_ENDPOINT}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      enabled: Boolean(token),
    }
  ); 

};

export default useUser;

import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useUserProfile = (userId) => {
  const { globalState } = useGlobalState();
  const { token } = globalState;
  const params = useQuery(
    ['_user', userId],
    () =>
      axios.get(`${config.BASE_ENDPOINT}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      enabled: Boolean(token),
    }
  );

  return params;
};

export default useUserProfile;

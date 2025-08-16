import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useNotifications = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const query = useQuery('notifications', () =>
    axios.get(`${config.BASE_ENDPOINT}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );

  return query;
};

export default useNotifications;

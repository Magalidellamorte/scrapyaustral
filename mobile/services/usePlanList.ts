import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const usePlanList = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const query = useQuery('plans_list', () =>
    axios.get(`${config.BASE_ENDPOINT}/plans`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );

  return query;
};

export default usePlanList;

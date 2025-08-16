import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const usePostulation = (postulationId) => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const query = useQuery(['postulation', postulationId], () =>
    axios.get(`${config.BASE_ENDPOINT}/postulations/${postulationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );

  return query;
};

export default usePostulation;

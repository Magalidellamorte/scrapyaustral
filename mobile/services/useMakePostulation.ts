import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useMakePostulation = (offerId) => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation((data) =>
    axios.post(`${config.BASE_ENDPOINT}/offers/${offerId}/postulations`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );

  return mutation;
};

export default useMakePostulation;

import axios from 'axios';
import { useMutation } from 'react-query';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useRatingSeller = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation(({ postulationId, message, rating }) =>
    axios.post(
      `${config.BASE_ENDPOINT}/postulations/${postulationId}/rating`,
       {
        message,
        rating
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );

  return mutation;
};

export const useRatingTorky = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation(({ torkyId, message, rating }) =>
   {
    return axios.put(
      `${config.BASE_ENDPOINT}/offers.torky/${torkyId}/rating`,
       {
        message,
        rating
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
   }
  );

  return mutation;
};

export default useRatingSeller;

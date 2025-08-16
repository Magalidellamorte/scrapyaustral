import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useConfirmPostulation = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation(({ postulationId, reason, rating }) =>
    axios.post(
      `${config.BASE_ENDPOINT}/postulations/${postulationId}/confirm`,
       {
        reason,
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

export default useConfirmPostulation;

import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useClosePostulation = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation(({ postulationId, reasonId }) =>
    axios.post(
      `${config.BASE_ENDPOINT}/postulations/${postulationId}/cancel`,
      {
        reasonId,
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

export default useClosePostulation;

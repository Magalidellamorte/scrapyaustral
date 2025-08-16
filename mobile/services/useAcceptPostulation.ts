import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useAcceptPostulation = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation((postulationId) =>
    axios.post(
      `${config.BASE_ENDPOINT}/postulations/${postulationId}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );

  return mutation;
};

export default useAcceptPostulation;

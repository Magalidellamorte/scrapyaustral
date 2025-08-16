import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useWithdrawMaterial = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation((postulationId) =>
    axios.post(
      `${config.BASE_ENDPOINT}/postulations/${postulationId}/start_withdrawal`,
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

export default useWithdrawMaterial;

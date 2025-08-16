import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useRequestSupport = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation((question) =>
    axios.post(
      `${config.BASE_ENDPOINT}/support`,
      {
        question,
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

export default useRequestSupport;

import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useCloseOffer = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation(({ offerId, reasonId }) =>
    axios.post(
      `${config.BASE_ENDPOINT}/offers/${offerId}/close`,
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

export default useCloseOffer;

import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useOffer = (offerId) => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const query = useQuery(['offer', offerId], () =>
    axios.get(
      `${config.BASE_ENDPOINT}/offers/${offerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      {
        enabled: Boolean(offerId),
      }
    )
  );

  return query;
};

export default useOffer;

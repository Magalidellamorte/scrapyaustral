import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useOfferStatuses = () => {
  const query = useQuery('offer_statuses', () =>
    axios.get(`${config.BASE_ENDPOINT}/offer_statuses`)
  );

  return query;
};

export default useOfferStatuses;

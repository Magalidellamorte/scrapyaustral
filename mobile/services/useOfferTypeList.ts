import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useOfferTypeList = () => {
  const query = useQuery('offer_types', () =>
    axios.get(`${config.BASE_ENDPOINT}/offer_types`)
  );

  return query;
};

export default useOfferTypeList;

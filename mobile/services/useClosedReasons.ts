import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useClosedReasons = () => {
  const query = useQuery('closed_reasons', () =>
    axios.get(`${config.BASE_ENDPOINT}/closed_reasons`)
  );

  return query;
};

export default useClosedReasons;

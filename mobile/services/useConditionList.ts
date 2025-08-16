import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useConditionList = () => {
  const query = useQuery('conditions', () =>
    axios.get(`${config.BASE_ENDPOINT}/conditions`)
  );

  return query;
};

export default useConditionList;

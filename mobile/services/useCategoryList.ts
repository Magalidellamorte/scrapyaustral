import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useCategoryList = () => {
  const query = useQuery('categories', () =>
    axios.get(`${config.BASE_ENDPOINT}/categories`)
  );

  return query;
};

export default useCategoryList;

import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useProvinceList = () => {
  const query = useQuery('provinces', () =>
    axios.get(`${config.BASE_ENDPOINT}/provinces?include[]=unused`)
  );

  return query;
};

export default useProvinceList;

import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useCityList = (provinceId) => {
  const query = useQuery(
    ['cities', provinceId],
    () =>
      axios.get(
        `${config.BASE_ENDPOINT}/provinces/${provinceId}/cities?include[]=unused`
      ),
    { enabled: Boolean(provinceId) }
  );

  return query;
};

export default useCityList;

import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useNeighborhoodList = (cityId) => {
  const query = useQuery(
    ['cities', cityId],
    () =>
      axios.get(
        `${config.BASE_ENDPOINT}/cities/${cityId}/neighborhoods?include[]=unused`
      ),
    { enabled: Boolean(cityId) }
  );

  return query;
};

export default useNeighborhoodList;

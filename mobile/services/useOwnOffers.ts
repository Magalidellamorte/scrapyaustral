import axios from 'axios';
import { get } from 'lodash';
import { useInfiniteQuery, useQuery } from 'react-query';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';
import getStringFromFilters, { Filters } from '../helpers/getStringFromFilters';

const useOwnOffers = (filters: Filters) => {
  const filterString = getStringFromFilters(filters);

  const { globalState } = useGlobalState();
  const { token } = globalState;

  const query = useInfiniteQuery(
    'own_offers',
    ({ pageParam = 0 }) =>
      {
        return axios.get(
        `${config.BASE_ENDPOINT}/offers?own=true${filterString}&page=${pageParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      },
    {
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = get(lastPage, 'data[0].current_page', 0);
        const lastPageValue = get(lastPage, 'data[0].last_page', 1);

        return currentPage < lastPageValue ? currentPage + 1 : undefined;
      },
    }
  );

  return query;
};


export const useOwnPickupOffers = (isHistory: boolean = false) => {
  const { globalState } = useGlobalState();
  const { token } = globalState;
  const query = useQuery(
    `pickup_offers_${isHistory}`,
    () => {
      return axios.get(
        `${config.BASE_ENDPOINT}/torkies?history=${isHistory}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    }
  );

  return query;
};

export default useOwnOffers;

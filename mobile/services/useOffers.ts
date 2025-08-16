import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

import { get } from 'lodash';
import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';
import getStringFromFilters, { Filters } from '../helpers/getStringFromFilters';

const useOffers = (limit = 0, filters: Filters) => {
  const filterString = getStringFromFilters(filters);
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const query = useInfiniteQuery(
    ['use_offers', limit],
    ({ pageParam = 0 }) =>

      {
   return  axios.get(
      `${config.BASE_ENDPOINT}/offers?limit=${limit}${filterString}&page=${pageParam}&_=${new Date().getTime()}`,
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

export default useOffers;

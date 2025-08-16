import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { get } from 'lodash';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';
import getStringFromFilters, { Filters } from '../helpers/getStringFromFilters';

const useOwnPostulations = (filters: Filters) => {
  const filterString = getStringFromFilters(filters);

  const { globalState } = useGlobalState();
  const { token } = globalState;
  const query = useInfiniteQuery(
    'own_postulations',
    ({ pageParam = 0 }) =>
          axios.get(
            `${config.BASE_ENDPOINT}/postulations?own=true${filterString}&page=${pageParam}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          
        {
          getNextPageParam: (lastPage, allPages) => {
            const currentPage = get(lastPage, 'data.current_page', 0);
            const lastPageValue = get(lastPage, 'data.last_page', 1);

            return currentPage < lastPageValue ? currentPage + 1 : undefined;
          },
        }
  );

  return query;
};

export default useOwnPostulations;

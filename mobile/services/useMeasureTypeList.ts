import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useMeasureTypeList = () => {
  const query = useQuery('measure_types', () =>
    axios.get(`${config.BASE_ENDPOINT}/measure_types`)
  );

  return query;
};

export default useMeasureTypeList;

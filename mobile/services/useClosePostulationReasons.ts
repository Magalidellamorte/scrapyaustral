import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useCloseePostulationReasons = () => {
  const query = useQuery('closed_postulation_reasons', () =>
    axios.get(`${config.BASE_ENDPOINT}/closed_postulation_reasons`)
  );

  return query;
};

export default useCloseePostulationReasons;

import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useLocalidadesList = () => {
  const query = useQuery('localidades', () =>
    axios.get(`${config.BASE_ENDPOINT}/localidades`).catch(() => ({
      data: [
        {
          id: 1,
          nombre: 'La Plata'
        }
      ]
    }))
  );

  return query;
};

export default useLocalidadesList; 
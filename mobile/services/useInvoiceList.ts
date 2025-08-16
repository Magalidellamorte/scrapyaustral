import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useInvoiceList = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const query = useQuery('invoice_list', () =>
    axios.get(`${config.BASE_ENDPOINT}/invoices`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );

  return query;
};

export default useInvoiceList;

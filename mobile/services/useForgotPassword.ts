import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useForgotPassword = () => {
  const mutation = useMutation((data) =>
    axios.post(`${config.BASE_ENDPOINT}/auth/forgot-password`, data)
  );

  return mutation;
};

export default useForgotPassword;

import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';

const useResetPassword = () => {
  const mutation = useMutation((data) =>
    axios.post(`${config.BASE_ENDPOINT}/auth/reset-password`, data)
  );

  return mutation;
};

export default useResetPassword;

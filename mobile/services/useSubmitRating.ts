import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useSubmitRating = (ratingId) => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const mutation = useMutation(({ rating, message }) =>
    axios.patch(
      `${config.BASE_ENDPOINT}/ratings/${ratingId}`,
      {
        rating,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );

  return mutation;
};

export default useSubmitRating;

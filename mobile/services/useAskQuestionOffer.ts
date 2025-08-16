import { useMutation } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useAskQuestionOffer = () => {
  const { globalState } = useGlobalState();
  const { token } = globalState;
  const mutation = useMutation(({ offerId, question }) =>{
    axios.post(
      `${config.BASE_ENDPOINT}/offers/${offerId}/ask_question`,
      {
        question,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }

  );

  return mutation;
};

export default useAskQuestionOffer;

import { useQuery } from 'react-query';
import axios from 'axios';

import config from '../config/config';
import { useGlobalState } from '../context/GlobalStateContext';

const useChatList = (scraper) => {
  const { globalState } = useGlobalState();
  const { token } = globalState;

  const query = useQuery(['chat_list', scraper], () =>
    axios.get(`${config.BASE_ENDPOINT}/chats?scraper=${scraper}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );

  return query;
};

export default useChatList;

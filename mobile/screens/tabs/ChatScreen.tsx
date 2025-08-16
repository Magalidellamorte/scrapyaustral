import get from 'lodash/get';
import * as React from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import cn from 'react-native-classnames';

import ChatList from '../../components/ChatList';
import EmptyChatHistory from '../../components/EmptyChatHistory';
import Header from '../../components/Header';
import Layout from '../../constants/Layout';
import { useGlobalState } from '../../context/GlobalStateContext';
import useToggle from '../../hooks/useToggle';
import useChatList from '../../services/useChatList';
import useUser from '../../services/useUser';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: StatusBar.currentHeight,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 130,
    paddingTop: 10,
    backgroundColor: 'white',
    minHeight: Layout.window.height - StatusBar.currentHeight - 99,
  },
  tabText: {
    fontSize: 18,
    textAlign: 'center',
  },
  tabTextActive: {
    fontWeight: '900',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  tabItem: {
    alignContent: 'center',
    height: 50,
    width: Layout.window.width / 2,
    justifyContent: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 4,
  },
  itemActive: {
    borderBottomColor: '#49DA8B',
    borderBottomWidth: 2,
  },
  unreadCount: {
    position: 'absolute',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: '#49DA8B',
    color: 'white',
    right: 10,
  },
});

export default function ChatScreen() {
  const { data } = useUser();
  const user = get(data, 'data', {});

  const [tabStatus, toggleTabStatus] = useToggle(false);
  const { globalState } = useGlobalState();
  const { socket } = globalState;

  React.useEffect(() => {
    if (user.id && socket) {
      socket.emit('user-connected', {
        userId: user.id,
      });
    }
  }, [user.id, socket]);

  const chatList = useChatList(tabStatus);

  const chats = get(chatList, 'data.data', []);

  const clientPressHandler = () => {
    if (tabStatus) {
      toggleTabStatus();
    }
  };

  const scraperPressHandler = () => {
    if (!tabStatus) {
      toggleTabStatus();
    }
  };

  const unreadCount = chats.reduce((acc, chat) => acc + chat.unread_count, 0);

  return (
    <>
      <Header rounded={false} />
      {user?.scraper ? (
        <View style={styles.tabs}>
          <Pressable onPress={clientPressHandler}>
            <View
              style={cn(styles, 'tabItem', {
                itemActive: !tabStatus,
              })}
            >
              <Text
                style={cn(styles, 'tabText', {
                  tabTextActive: !tabStatus,
                })}
              >
                Vendedor
              </Text>

              {!tabStatus && unreadCount > 0 && (
                <View style={styles.unreadCount}>
                  <Text style={{ color: 'white' }}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </Pressable>

          <Pressable onPress={scraperPressHandler}>
            <View
              style={cn(styles, 'tabItem', {
                itemActive: tabStatus,
              })}
            >
              <Text
                style={cn(styles, 'tabText', {
                  tabTextActive: tabStatus,
                })}
              >
                Comprador
              </Text>

              {tabStatus && unreadCount > 0 && (
                <View style={styles.unreadCount}>
                  <Text style={{ color: 'white' }}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      ) : null}

      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => chatList.refetch()}
            refreshing={chatList.isLoading || chatList.isFetching}
          />
        }
      >
        <View style={styles.content}>
          {chats.length ? <ChatList chats={chats} /> : <EmptyChatHistory />}
        </View>
      </ScrollView>
    </>
  );
}

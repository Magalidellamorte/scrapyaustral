import React, { ReactNode } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Spacer from './Spacer';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 17,
  },
  itemText: {
    marginTop: 5,
  },
  item: {
    flexDirection: 'row',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 1,
    paddingTop: 0,
    paddingBottom: 10,
    marginTop: 0,
    width: '100%',
  },
  right: {
    position: 'absolute',
    right: 0,
    marginTop: 4,
  },
});
type MenuProfileProps = {
  children?: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  user?: any | null;
  icon?: any | null;
};

function MenuProfile({ children, onPress, user, icon }: MenuProfileProps) {
  return (
    <>
      <Pressable onPress={onPress} style={styles.item}>
        <AntDesign
          size={23}
          style={{ marginTop: 3 }}
          name={icon}
          color="#39b76f"
        />

        <Spacer orientation="vertical" />
        <Text style={[styles.text, styles.itemText]}>{children}</Text>

        <AntDesign
          size={23}
          style={styles.right}
          name="right"
          color="#39b76f"
        />
      </Pressable>

      <Spacer size={30} />
    </>
  );
}

MenuProfile.defaultProps = {
  user: {},
  icon: '',
  children: '',
};

export default MenuProfile;

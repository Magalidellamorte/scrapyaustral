import React, { ReactNode } from 'react';
import { Text,  View, Image } from 'react-native';
import MensajeImg from '../assets/images/mensaje.png';

type MensajeProps = {
  children: any;
  style?: any;
};

function Mensaje({ children }: MensajeProps) {
  return (
    <>
      <View style={{ position: 'relative' }}>
        <Image
          source={MensajeImg}
          style={{
            height: 300,
            flex: 1,
            width: null,
          }}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            top: '45%',
            width: '26%',
            right: '16.5%',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            alignSelf: 'flex-end',
            transform: [{ rotate: '-7deg' }],
          }}
        >
          <Text style={{
            textAlign: 'center',
            fontSize: 14,
          }}>{children}</Text>
        </View>
      </View>
    </>
  );
}

Mensaje.defaultProps = {
  style: {},
};

export default Mensaje;

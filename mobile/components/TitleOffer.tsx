import React, { ReactNode } from 'react';
import { Text, View, Image } from 'react-native';

type TitleOfferProps = {
  children: ReactNode;
  img?: any;
};

function TitleOffer({ children, img }: TitleOfferProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          flex: 0,
          height: 50,
          overflow: 'hidden',
        }}
      >
        <Image source={img} style={{ resizeMode: 'contain', width: '100%' }} />
      </View>

      <View
        style={{
          flex: 2.7,
          height: 50,
          paddingHorizontal: 5,
        }}
      >
        <Text style={{ fontSize: 15, marginVertical: 10, lineHeight: 30 }}>
          {children}
        </Text>
      </View>
    </View>
  );
}

TitleOffer.defaultProps = {};
export default TitleOffer;

import * as React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useIsFetching } from 'react-query';
import { ActivityIndicator } from 'react-native';

import Layout from '../constants/Layout';

function LoadingQueries() {
  const loading = useIsFetching();

  return loading ? ( 
    null
    // <View
    //   style={{
    //     position: 'absolute',
    //     width: Layout.window.width,
    //     height: Layout.window.height + StatusBar.currentHeight,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'rgba(0,0,0,0.5)',
    //   }}
    // >
    //   <ActivityIndicator size={35} color="#000" />
    //   <Text>Cargando...</Text>
    // </View>
  ) : null;
}

export default LoadingQueries;

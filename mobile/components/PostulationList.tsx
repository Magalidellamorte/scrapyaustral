import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import * as React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { useQueryClient } from 'react-query';

import useAcceptPostulation from '../services/useAcceptPostulation';
import useRejectPostulation from '../services/useRejectPostulation';
import AceptOffer from './AceptOffer';
import Button from './Button';
import DeleteOffer from './DeleteOffer';
import Spacer from './Spacer';

type Postulation = {
  id: number;
  offer_id: number;
  offer_status_id: number;
  pick_by_scraper: boolean | null;
  send_by_client: boolean | null;
  shipment_end_date: string;
  shipment_start_date: string;
  created_at: stirng;
  updated_at: string;
  user_id: number;
  value_with_shipping: string;
  value_without_shipping: string;
};

type PostulationListProps = {
  postulations: Postulation[];
};

const styles = StyleSheet.create({
  collapse: {
    marginVertical: 5,
  },
  header: {
    display: 'flex',
    alignContent: 'center',
  },
  headerText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 20,
    borderColor: '#c1c1c1',
    color: '#616161',
    borderWidth: 1,
    borderRadius: 10,
  },
  body: {
    marginTop: 10,
    padding: 10,
    borderColor: '#c1c1c1',
    borderWidth: 1,
    borderRadius: 10,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 16,
  },
});

function PostulationList({ postulations }: PostulationListProps) {
  const navigation = useNavigation();
  const acceptPostulation = useAcceptPostulation();
  const rejectPostulation = useRejectPostulation();
  const queryClient = useQueryClient();

  const viewPostulationHandler = (postulationId) => () => {
    navigation.navigate('ViewPostulation', {
      id: postulationId,
    });
  };

  const acceptPostulationHandler = (type, postulationId, offerId) => {
    const query = type === 'accept' ? acceptPostulation : rejectPostulation;

    query.mutate(postulationId, {
      onSuccess: () => {
        queryClient.invalidateQueries(['offer', offerId]);

        Toast.show({
          type: 'success',
          text1:
            type === 'accept'
              ? '¡Has aceptado la oferta!'
              : '¡Has rechazado la oferta!',
          position: 'bottom',
          visibilityTime: 500,
        });

        navigation.navigate('ViewPostulation', {
          id: postulationId,
          showSummary: true,
        });
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1:
            error?.response?.data?.message ??
            (type === 'accept'
              ? 'Error al aceptar la oferta'
              : 'Error al rechazar la oferta'),
          position: 'bottom',
          visibilityTime: 1000,
        });
      },
    });
  };

  return postulations.map((postulation) => (
    <Collapse key={postulation.id} style={styles.collapse}>
      <CollapseHeader style={styles.header}>
        <Text style={styles.headerText}>
          {postulation.user?.full_name} (
          {(postulation?.offer_status?.name || '').toLowerCase()})
        </Text>
        <Entypo
          name="dots-three-vertical"
          size={18}
          color="#616161"
          style={styles.icon}
        />
      </CollapseHeader>
      <CollapseBody style={styles.body}>
        {postulation.offer_status?.id === 2 ? (
          <>
            <Spacer />
            <Button
              type="grey"
              onPress={() => {
                const text =
                  'Hola, me interesa:  ' +
                  postulation.offer?.title +
                  ' - #' +
                  postulation.offer?.id;
                const url = `https://wa.me/5491133019016?text=${encodeURIComponent(
                  text
                )}`;
                Linking.openURL(url).catch((err) =>
                  console.error('Error al abrir WhatsApp', err)
                );
              }}
              // onPress={() =>
              //   navigation.navigate('ChatInternal', {
              //     toUser: postulation.user,
              //     offerId: postulation.offer_id,
              //   })
              // }
            >
              Ir al chat
            </Button>
            <Spacer />
          </>
        ) : null}
        <Button type="primary" onPress={viewPostulationHandler(postulation.id)}>
          Ampliar solicitud
        </Button>
        {postulation.offer_status?.id === 1 ? (
          <>
            <Spacer />

            <Button
              type="secondary"
              onPress={() =>
                acceptPostulationHandler(
                  'accept',
                  postulation.id,
                  postulation.offer_id
                )
              }
              disabled={acceptPostulation.isLoading}
            >
              Aceptar solicitud
            </Button>

            <Spacer />

            <Button
              type="dangerLight"
              onPress={() =>
                acceptPostulationHandler(
                  'reject',
                  postulation.id,
                  postulation.offer_id
                )
              }
              disabled={rejectPostulation.isLoading}
            >
              Rechazar solicitud
            </Button>
          </>
        ) : null}

        {postulation.offer_status?.name === 'En curso' ? (
          <>
            <Spacer />
            <AceptOffer
              offerId={postulation?.offer_id}
              postulations={postulations || []}
            />
            <Spacer />
            <DeleteOffer
              offerId={postulation?.offer_id}
              postulations={postulations || []}
            />
          </>
        ) : null}
      </CollapseBody>
    </Collapse>
  ));
}

export default PostulationList;

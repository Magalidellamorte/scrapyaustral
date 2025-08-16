import React, { useEffect } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Linking,
} from 'react-native';
import get from 'lodash/get';
import moment from 'moment';
import { formatCurrency } from 'react-native-format-currency';
import Header from '../../components/Header';
import useInvoiceList from '../../services/useInvoiceList';
import Button from '../../components/Button';
import Spacer from '../../components/Spacer';
import Title from '../../components/Title';
import useUser from '../../services/useUser';
import FooterOffer from '../../components/FooterOffer';
import WalletImg from '../../assets/images/wallet.png';
import PersonImg from '../../assets/images/walletPerson.png';

const styles = StyleSheet.create({
  container: { width: '100%' },
  content: {
    padding: 20,
  },
  invoiceContainer: {},
  personimage: {
    flex: 2,
    // position: 'absolute',
    // bottom:0,
    // left:0,
    // elevation: 10000,
    position: 'absolute',
    bottom: 1,
    right: -15,
    width: 185,
    height: 150,
    resizeMode: 'contain',

    // height: 70,
  },
  bloquew: {
    flex: 1,
    width: 100,
  },
  imagep: {
    width: '100%',
    position: 'absolute',
  },
  text: {
    fontSize: 20,
    fontWeight: '900',
  },
  textQuieres: {
    color: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: '900',
  },
  boxConvert: {
    overflow: 'hidden',
    position: 'relative',
    fontSize: 20,
    flexDirection: 'row',
    elevation: 1,
    backgroundColor: '#60d1e1',
    color: 'white',
    borderRadius: 35,
    padding: 20,
    fontWeight: 'normal',
  },
  button: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    // borderWidth: 0.11,
    fontSize: 13,
    textTransform: 'uppercase',
    fontWeight: '900',
    padding: 0,
    borderRadius: 50,
  },
  shadowProp: {
    // elevation: 10,
    // shadowColor: 'red',
    // shadowOffset: { width: -2, height: 4 },
    // shadowOpacity: 1,
    // shadowRadius: 3,
  },
  image: {
    maxHeight: 250,

    left: -20,
    resizeMode: 'contain',
  },
});

export default function PaymentHistoryScreen({ route, navigation }) {
  const random = route?.params?.random;

  const cardNotification = (text: string, shorText = '', changePlan) => (
    <>
      <View
        style={{
          backgroundColor: '#49DA8B',
          paddingVertical: 10,
          alignItems: 'center',
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: 18,
          }}
        >
          {text}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: 12,
          }}
        >
          {shorText ? <>{shorText}</> : null}
          {changePlan ? (
            <>
              {shorText ? ' - ' : ''}
              <Text
                onPress={() => navigation.navigate('SelectPlan')}
                style={{ textDecorationLine: 'underline' }}
              >
                {changePlan}
              </Text>
            </>
          ) : null}
        </Text>
      </View>
      <Spacer size={20} />
    </>
  );

  const invoicesCall = useInvoiceList();
  const userCall = useUser();
  const invoices = get(invoicesCall, 'data.data', []);
  const subscriptions = get(userCall, 'data.data.subscriptions', []);

  const onRefresh = () => {
    invoicesCall.refetch();
    userCall.refetch();
  };

  useEffect(() => {
    invoicesCall.refetch();
    userCall.refetch();
  }, [random]);

  const price = (value: number) => {
    const [valueFormattedWithSymbol] = formatCurrency({
      amount: Number(value),
      code: 'ARS',
    });
    return valueFormattedWithSymbol;
  };

  let text = '';
  let shortText = '';
  let changePlan = '';

  if (subscriptions.length > 0) {
    const planEnCurso = subscriptions[0].plan.name;

    if (
      subscriptions[0].free_time &&
      moment().isAfter(subscriptions[0].ends_at) &&
      moment().isAfter(subscriptions[0].trial_ends_at)
    )
      text = 'Prueba gratuita finalizada';

    // if(!subscriptions[0].free_time && moment().isAfter(subscriptions[0].ends_at) && moment().isAfter(subscriptions[0].trial_ends_at))
    //  text = `Plan ${planEnCurso} suspendido`;

    if (moment().isBefore(subscriptions[0].trial_ends_at)) {
      text = `Prueba gratuita del plan ${planEnCurso} esta en curso`;
      shortText = `Vto: ${moment(subscriptions[0].trial_ends_at).format(
        'D/M/Y'
      )}`;
    }

    if (!text) {
      const hasInvoice = invoices.filter((invoice: any) => !invoice.paid_at);
      if (hasInvoice.length) {
        text = `Plan ${planEnCurso} pendiente de pago`;
      } else {
        text = `Plan ${planEnCurso} en curso`;
        shortText = `Vto: ${moment(subscriptions[0].ends_at).format('D/M/Y')}`;
      }
      changePlan = `Cambiar de plan`;
    }
  }

  return (
    <>
      <Header title="Historial de pagos" rounded={false} />
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={invoicesCall.isLoading || invoicesCall.isRefetching}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.content}>
            {text ? cardNotification(text, shortText, changePlan) : null}

            <Spacer size={20} />
            {invoices.length > 0 ? (
              invoices.map((invoice: any) => (
                <>
                  <View key={`k_${invoice.id}`} style={styles.invoiceContainer}>
                    {invoice.paid_at ? (
                      <Button onPress={() => {}} type="primary">
                        {price(invoice.amount)} pagados el{' '}
                        {moment(invoice.paid_at).format('D/M/Y')}
                      </Button>
                    ) : (
                      <Button
                        type="secondary"
                        onPress={() => {
                          Linking.openURL(invoice.payment_link);
                        }}
                      >
                        Pagar {price(invoice.amount)}
                      </Button>
                    )}
                  </View>
                  <Spacer size={20} />
                </>
              ))
            ) : (
              <>
                <View style={{ alignContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={WalletImg}
                    style={{
                      height: 111,
                      width: 100,
                      resizeMode: 'contain',
                    }}
                  />
                  <Text>Aún no tienes pagos</Text>
                  <Spacer size={70} />
                </View>
              </>
            )}

            {subscriptions.length === 0 ||
            (subscriptions[0]?.free_time &&
              moment().isAfter(subscriptions[0].trial_ends_at)) ? (
              <>
                <View style={{ alignContent: 'center', alignItems: 'center' }}>
                  <View style={styles.container}>
                    <View style={[styles.boxConvert, styles.shadowProp]}>
                      <View style={styles.bloquew}>
                        <Spacer size={20} />
                        <Title
                          style={{
                            color: 'white',
                            textAlign: 'left',
                            marginBottom: 10,
                            fontSize: 15,
                          }}
                        >
                          ¡Comenzá a ofertar ya!
                        </Title>

                        <Spacer size={20} />
                        <View style={{ paddingRight: 160 }}>
                          <Button
                            onPress={() => navigation.navigate('SelectPlan')}
                            style={styles.button}
                            type="radiusBeScrapper"
                          >
                            Selecciona tu plan
                          </Button>
                        </View>
                      </View>
                    </View>
                    <Image source={PersonImg} style={styles.personimage} />
                  </View>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <FooterOffer />
    </>
  );
}

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Text,
  Pressable, 
  useWindowDimensions } from 'react-native';
import get from 'lodash/get';
import {
  formatCurrency,
} from "react-native-format-currency";
import RenderHtml from 'react-native-render-html';
import axios from 'axios';
import Header from '../../components/Header';
import Title from '../../components/Title';
import usePlanList from '../../services/usePlanList';
import Spacer from '../../components/Spacer';
import Button from '../../components/Button';
import { useGlobalState } from '../../context/GlobalStateContext';
import config from '../../config/config';


const styles = StyleSheet.create({
  container: { width: '100%'},
  content: {
    padding: 20,
  },
  planContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    transition: '1s',
  },
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
    resizeMode: 'contain'

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
    fontWeight: "900",
  },
  textQuieres: {
    color: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "900",
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
    fontSize: 15,
    textTransform: 'uppercase',
    fontWeight: "900",
    padding: 0,
    borderRadius: 50,
  },
});


export default function SelectPlanScreen({ navigation }) {
  const [ planSelect, setPlanSelect ] = useState(null)
  const [ disabled, setDisabled ] = useState(true)
  const { globalState } = useGlobalState();
  const { token } = globalState;
  const plansCall = usePlanList();
  const plans = get(plansCall, 'data.data', []);
  const onRefresh = () => { plansCall.refetch(); };
  const { width } = useWindowDimensions();
  const handleSubmit = () => 
  {
    if(planSelect.id){
      setDisabled(true)
      const body = new FormData();
      body.append('plan_id', planSelect.id);
      axios.post(`${config.BASE_ENDPOINT}/subscription`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }).then(() =>{
          navigation.navigate('PaymentHistory', {random: Math.random()});
      })
    }
  }
  const price = (value:number) => {
    const [valueFormattedWithSymbol] =  formatCurrency({ amount: Number(value), code: 'ARS'})
    return valueFormattedWithSymbol;
  }

  return (
    <>
      <Header rounded={false} />
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={plansCall.isLoading || plansCall.isRefetching}
          />
        }
      >
        
        <View style={styles.container}>
          <View style={styles.content}>
          <Title>Selecioná tu plan</Title>
          <Spacer size={30} />
             { plans.map((plan:any) => (<>
                <Pressable key={`p_${plan.id}`}  onPress={()=>{  setDisabled(false); setPlanSelect(plan) }} >
                  <View style={[styles.planContainer, { borderColor: planSelect?.id === plan.id ? '#49DA8B' : '#333',  borderWidth: planSelect?.id===plan.id ? 3 : 1, }]}>
                    <Title>{plan.name}</Title>
                    <RenderHtml
                      contentWidth={width}
                      source={{html:plan.text}}
                    />
                    <Text style={{textAlign:'right',fontSize: 20,fontWeight:'900',marginTop:25,color:'#49DA8B'}}>{price(plan.price)}</Text>
                  </View>
                </Pressable>
              <Spacer size={50} />
              </>
            ))}
          </View>
        </View> 
        <Button onPress={() => { handleSubmit() }} disabled={disabled} type="secondary">Continuar{planSelect ? ` con plan ${planSelect?.name}` : null}</Button>
        
      </ScrollView>

    </>
  );
}

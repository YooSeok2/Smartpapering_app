import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView, StyleSheet,View, Text, Alert, Dimensions} from 'react-native';
import EndTrade from './EndTrade';
import PgTrade from './PgTrade';
import moment from 'moment';
import {Header} from '../components';
import {SSL_URL, LOCAL_URL} from '@env'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const {width} = Dimensions.get('window');


export default function TradeList ({route, navigation}){
    const [orderLeng, setOrderLeng] = useState({pg : '0', end : '0'});
    const [orders, setOrders] = useState([]);
    const [endOrders, setEndOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    
    
    const statusArray = [{status : '시공접수', color : '#eccc2c'}, {status : '시공진행', color : '#38b9b5'}, {status : '시공완료', color : '#0451eb'}, {status : '거래취소', color : '#ff5d5d'}];

    useEffect(()=>{
        getTradeData();   
    },[])
    
    
    const onRefresh = useCallback(()=>{
        setRefreshing(true);
        getTradeData();
    })

    const getTradeData = async() =>{
        fetch(`${SSL_URL}/api/order/${route.unique}`)
        .then(res=>res.json())
        .then(res=>{
            if(!res.result){
                Alert.alert("",
                    "서버 문제로 거래내역 정보를 받을 수 없습니다.",[
                        {
                            text : '확인'
                        }
                    ]
                )
            }else{
                const orderArray = res.data;
                const orders = orderArray.map(data=>{
                    const newDate = moment(data.createdAt).format('YYYY-MM-DD');
                    const newUpdateDate = moment(data.updatedAt).format('YYYY-MM-DD');
                    const newObj = {
                        ...data,
                        createdAt : newDate,
                        updatedAt : newUpdateDate
                    }
                    return newObj
                }) 
                
                return orders;
            }
        })
        .then(res=>{
            
            let pgOrders=[],endOrders=[];
            res.forEach(data=>{
                if(data.status === '시공접수' || data.status === '시공진행'){
                    pgOrders.push(data);
                }else{
                    endOrders.push(data);
                }
            });
            setOrderLeng({
                pg : pgOrders.length,
                end : endOrders.length
            });
            setOrders(pgOrders);
            setEndOrders(endOrders);
            
        })
        .catch(err=>console.log(err));
        setRefreshing(false);
    }


    const Tab = createMaterialTopTabNavigator();
    
    return(
        <SafeAreaView style = {styles.container}>
            <Header title={"거래내역"} useBackBtn={false} route={route} navigation={navigation}/>
            <View style={styles.totalTrade}>
                        <View style={styles.orderLeng}>
                            <Text style={styles.lengTitle}>진행</Text>
                            <Text style={styles.lengTxt}>{orderLeng.pg}건</Text>
                        </View>
                        <View style={styles.orderLeng}>
                            <Text style={styles.lengTitle}>완료</Text> 
                            <Text style={styles.lengTxt}>{orderLeng.end}건</Text>
                        </View>
            </View>
            <Tab.Navigator
                initialRouteName="PgTrade"
                tabBarPosition = 'top'
                tabBarOptions = {
                    {
                        showLabel : true,
                        style : {backgroundColor : '#ffffff', marginTop : 1},
                        activeTintColor : '#87c1fc',
                        inactiveTintColor : '#808080',
                        indicatorStyle : {color : '#87c1fc', opacity:.3 },
                        labelStyle : {fontSize : 14}
                    }
                }
                initialLayout = {width}
            >
                <Tab.Screen 
                    name = "PgTrade" 
                    options={{tabBarLabel : '진행'}}
                    children={()=><PgTrade statusArray={statusArray} pgOrders={orders} refreshing={refreshing} onRefresh={onRefresh} />}
                />
                <Tab.Screen 
                    name = "EndTrade" 
                    options={{tabBarLabel : '완료'}}
                    children={()=><EndTrade statusArray={statusArray} endOrders={endOrders} refreshing={refreshing} onRefresh={onRefresh} />}
                />           
            </Tab.Navigator>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    totalTrade : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        width : width,
        marginTop : 7,
        paddingVertical : 20,
        paddingHorizontal : 30,
        backgroundColor : '#ffffff',
        alignItems : 'center',
   
    },
    orderLeng : {
        alignItems : 'center',
        justifyContent : 'center',
        flex : 1
    },
    lengTitle : {
        fontSize : 14,
        marginBottom : 5,
        color : '#808080',
        textAlign : 'center'
    },
    lengTxt : {
        fontSize : 17,
        color : '#1d1d1f',
        fontWeight : 'bold',
        textAlign : 'center'
    },
    tabbar : {
        width : width,
        marginTop : 1,
        backgroundColor:"#ffffff"
    }
})
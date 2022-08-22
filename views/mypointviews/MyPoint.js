import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView, StyleSheet, Dimensions,View, Text, TextInput, Alert} from 'react-native';
import { CustomBtn, Header } from '../components';
import moment from 'moment';
import {SSL_URL, LOCAL_URL} from "@env";
import EndWithdraw from './EndWithdraw';
import PgWithdraw from './PgWithdraw';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Validate} from '../../prototypes/validate'

const {width, height} = Dimensions.get('window');


export default function MyPoint({navigation,route}){
    const [point,setPoint] = useState('0');
    const [pgPoint,setPgPoint] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [withdraws, setWithdraws] = useState([]);
    const [endWithdraws, setEndWithdraws] = useState([]);
    const [vaildPoint, setVaildPoint] = useState(true);

    const statusArray = [{status : '접수', color : '#38b9b5'}, {status : '완료', color : '#ff5d5d'}];

    useEffect(()=>{
        getPointData();
        getWithdrawData();
    }, []);

    const onRefresh = useCallback(()=>{
        setRefreshing(true);
        getWithdrawData();
        getPointData();
    })

    const numberWithCommas = (val)=>{ //세번째자리마다 콤마찍어서 리턴
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const getWithdrawData = async()=>{
        fetch(`${SSL_URL}/api/withdraw/${route.unique}`)
        .then(res=>res.json())
        .then(res=>{
            if(!res.result){
                Alert.alert("",
                "서버 문제로 출금내역 정보를 받을 수 없습니다.",[
                    {
                        text : '확인'
                    }
                ]
                )
            }else{
                const withdrawArray = res.data;
                const withdraws = withdrawArray.map(data=>{
                    const newDate = moment(data.createdAt).format('YYYY-MM-DD')
                    const newUpdateDate = moment(data.updatedAt).format('YYYY-MM-DD');
                    
                    const newObj = {
                        ...data,
                        createdAt : newDate,
                        updatedAt : newUpdateDate
                    }
                    return newObj
                }) 
                
                return withdraws;
            }
        })
        .then(res=>{
            let pgWithdraws=[],endWithdraws=[];
         
            res.forEach(data=>{
                if(data.status === '접수'){
                    pgWithdraws.push(data);
                }else{
                    endWithdraws.push(data);
                }
            });
            
          
            setWithdraws(pgWithdraws);
            setEndWithdraws(endWithdraws);
            setRefreshing(false);
        })
    }

    const getPointData = async()=>{
        fetch(`${SSL_URL}/api/user/special?unique=`+route.unique)
        .then(res=>res.json())
        .then(res=>{
            if(res.data){
                const point = res.data.point;
                setPoint(point);
            }
        })
    };

    const onClickWithdrawBtn =()=>{
        if(Validate.drawPrice_validate(pgPoint)){
            setVaildPoint(true);
            if(parseInt(point) < parseInt(pgPoint)){
                Alert.alert("",
                    "출금하시려는 금액보다\n보유하신 포인트가 부족합니다.",
                    [
                        {
                            text : '확인'
                        }
                    ]
                )
            }else{
                navigation.navigate('Certification', {name : 'mypoint', ...route, point : point, pgPoint : pgPoint});
            }
        }else{
            setVaildPoint(false);
        }
       
    }

    const onControllPgPoint =(text)=>{
        setPgPoint(text);
    }
    const Tab = createMaterialTopTabNavigator();

    return(
        <SafeAreaView style = {styles.container}>
            <Header title={"내포인트"} useBackBtn={false} route={route} navigation={navigation}/>
            <View style={styles.contentBox}>
                <View style = {styles.nowPointBox}>
                    <Text style={styles.pointTitle}>출금가능포인트 : </Text>
                    <Text style={styles.nowPoint}>{numberWithCommas(point)}</Text>
                    <Text style={styles.nowWon}> 원</Text>
                </View>
                <View style = {styles.pointBox}>
                    <TextInput
                        style = {styles.input}
                        placeholder = '출금금액 입력'
                        value = {pgPoint}
                        onChangeText = {onControllPgPoint}
                        autoCorrect = {false}
                        keyboardType = 'number-pad'
                        maxLength = {14}       
                    />
                    <Text style={styles.won}>원</Text>
                </View>
                {vaildPoint
                    ?
                    <></>
                    :
                    <Text style={styles.invaildPoint}>최소 출금금액은 10,000원 이상입니다.</Text>
                }
                <CustomBtn title={'출금하기'} customWidth ={width-100} btnOnClickLitener={onClickWithdrawBtn} customHeight={40} txtSize={16} customStyle={{marginBottom:5, marginTop:10}} />
            </View>        
            <Tab.Navigator
                initialRouteName="PgWithdraw"
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
                    name = "PgWithdraw" 
                    options={{tabBarLabel : '신청'}}
                    children={()=><PgWithdraw statusArray={statusArray} pgWithdraws={withdraws} refreshing={refreshing} onRefresh={onRefresh} />}
                />
                <Tab.Screen 
                    name = "EndWithdraw" 
                    options={{tabBarLabel : '완료'}}
                    children={()=><EndWithdraw statusArray={statusArray} endWithdraws={endWithdraws} refreshing={refreshing} onRefresh={onRefresh} />}
                />           
            </Tab.Navigator>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    withdrawList : {
        width : width,
        backgroundColor : '#ffffff',
        paddingHorizontal : 20,
        borderBottomColor : '#eeeeee',
        borderBottomWidth : 1,
    },
    withdrawTxt : {
        paddingVertical : 20,
        fontSize : 16,
        color : '#808080',

    },
    contentBox : {
        width : width,
        marginTop : 7,
        paddingVertical : 15,
        alignItems  : 'center',
        backgroundColor:"#ffffff",
    },
    title : {
        fontSize : 18,
        color : '#1d1d1f',
        marginBottom : 25
    },
    pointBox : {
        flexDirection : 'row',
        width : width - 100,
        alignItems : 'center',
        marginBottom : 3
    },
    input : {
        flex : 10,
        padding : 7,
        fontSize : 15,
        borderColor : '#dadada', 
        borderWidth : 1,
        textAlign : 'center',
        color : '#808080'
    },
    won : {
        flex : 1,
        fontSize : 16,
        marginLeft : 10,
        fontWeight : 'bold',
       
    },
    tradeList : {
        backgroundColor : '#ffffff'
    },
    tradeBox : {
        width : width,
        flexDirection : 'row',
        paddingVertical : 15,
        borderBottomColor : '#eeeeee',
        borderBottomWidth : 1,
        alignItems : 'center'
    },
    status : {
        textAlign : 'center',
        flex : 1,
        fontSize : 16,
        fontWeight : '900'
    },
    price : {
        textAlign : 'center',
        flex : .8,
        fontSize : 14
    },
    name : {
        textAlign : 'center',
        flex : .8,
        fontSize : 14
    },
    date : {
        textAlign : 'center',
        flex : 1.5,
        fontSize : 12
    },
    noTradeBox : {
        justifyContent : 'center',
        alignItems : 'center',
        height : height/3,
        width : width
    },
    noTrade : {
        fontSize : 20,
        color : '#c4c4c4'
    },
    tabbar : {
        width : width,
        marginTop : 1,
        backgroundColor:"#ffffff"
    },
    nowPointBox : {
        flexDirection : 'row',
        width : width - 100,
        alignItems : 'center',
        marginBottom : 18
    },
    pointTitle : {
        textAlign : 'left',
        fontSize : 15,
        marginLeft : 5,
        marginRight : 8
    },
    nowPoint : {
        fontSize : 16,
        color : '#1d1d1f'
    },
    nowWon : {
        flex : 1,
        fontSize : 15,
    },
    invaildPoint:{
        fontSize : 12,
        color : "#ff5d5d",
        width : width - 100,
        marginLeft : 5
    }
})
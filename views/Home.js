import React, {useEffect, useState} from 'react';
import { TouchableOpacity} from 'react-native';
import { Entypo , Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Order} from './orderviews';
import {MyPage} from './mypageviews';
import {MyPoint} from './mypointviews'
import TradeList from './tradelistviews/TradeList';
import {SSL_URL, LOCAL_URL} from "@env";


export default function Home({navigation, route}){
    const Tab = createBottomTabNavigator();
    const [user, setUser] = useState({});
    
    useEffect(() => {
        getUserData();
    }, []);

    const setUserLoginInfo = async(userInfo)=>{
        const clientToken = await AsyncStorage.getItem('isLogin');
        if(!userInfo.islogin){
            fetch(`${SSL_URL}/api/user/update/${userInfo.unique}`,{
                method : 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' + clientToken
                },
                body : JSON.stringify({
                            islogin : true
                        })
            })
            .then(res=>res.json())
            .then(res=>{
                if(!res.result){
                    Alert.alert("",
                    "네트워크 통신이 원활하지 않습니다.",[
                        {
                            text : '확인'
                        }
                    ])
                }
            })
            .catch(err=>console.log(err))
        } 
    }

    const getUserData = async()=>{
        const userUnique = await AsyncStorage.getItem('unique'); //await를 만나면 promise가 처리되길 기다렸다가 다음을 이행
        fetch(`${SSL_URL}/api/user/special?unique=${userUnique}`)
        .then(res=>res.json())
        .then(res=>{
            setUserLoginInfo(res.data);
            setUser(res.data);
        });
    }
    return(
        <Tab.Navigator
            initialRouteName="Order"
            tabBarOptions = {
                {
                    showLabel : false,
                    style : {backgroundColor : '#ffffff', height : 50},
                    activeTintColor : '#87c1fc',
                    inactiveTintColor : '#808080',
                }
            }
            screenOptions = {({route})=>({
                tabBarIcon : ({color}) => {
                    switch(route.name){
                        case 'Order' :
                            return <Ionicons name="cart" size={26} color={color} />
                        case 'MyPage' :
                            return  <Entypo name="dots-three-horizontal" size={23} color={color} />
                        case 'TradeList' :
                            return <MaterialCommunityIcons name="card-text-outline" size={24} color={color} />
                        case 'MyPoint':
                            return <FontAwesome5 name="coins" size={20} color={color} />
                    }
                },
                tabBarButton : props => <TouchableOpacity {...props} />
            })}
        >
            <Tab.Screen 
                name = "Order" 
                children={()=><Order route={user} navigation={navigation} />}
            />
            <Tab.Screen 
                name = "TradeList" 
                children={()=><TradeList route={user} navigation={navigation} />}
            />
            <Tab.Screen 
                name = "MyPoint" 
                children={()=><MyPoint route={user} navigation={navigation} />}
            />  
            <Tab.Screen 
                name = "MyPage" 
                children={()=><MyPage route={user} navigation={navigation} />}
            />              
        </Tab.Navigator>
    )
} 



import React, {useEffect, useState} from 'react';
import AppLoading from "expo-app-loading";
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators  } from '@react-navigation/stack';
import Home from './views/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Login, LoginHome, SignUp, SignUpCertification} from './views/startviews';
import {Certification, ChangePassword} from './views/componentpages';
import {OrderAddress, OrderCustomer, OrderComplete} from './views/orderviews';
import {Push, Settings, Secession, Terms, Privacy} from './views/mypageviews';
import {WithdrawInfo, CompleteWithdraw,} from './views/mypointviews';
import {SSL_URL, LOCAL_URL} from "@env";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';


let isSameToken = true; // notification 토큰을 가져오고 현재 토큰과 비교를 위한 전역변수

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App(){
  const [isLoaded, setIsLoaded]=useState(false);
  const [logined, setLogined] = useState(false);

  useEffect(()=>{
    registerForPushNotificationsAsync().then(async(token)=>{
        AsyncStorage.setItem('expoToken', token);   
        _loadedHome(token);
    })
  },[])

  const _loadedHome = async (expoToken)=>{
    const clientToken = await AsyncStorage.getItem('isLogin');
    if(clientToken){
      fetch(`${SSL_URL}/api/user/verify`,{
        method : 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + clientToken
        }
      })
      .then(res => res.json())
      .then(res => {
        if(!res.result){
            setLogined(false);
            setTimeout(()=>{
             setIsLoaded(true);
            }, 1000)
        }else{
          AsyncStorage.setItem('unique', res.unique);

          const nowDate = new Date();
          const expDate = res.token_exp*1000;
          const elapsedMSec = expDate - nowDate.getTime();
          const elapsedDay = elapsedMSec / 1000 / 60 / 60 / 24;
          
          if(elapsedDay < 8){ // 현재 앱 접근권한 토큰의 만료일이 8일미만일 경우 새로운 토큰 발급
            fetch(`${SSL_URL}/api/user/getrefreshtoken`,{
              method : 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization' : 'Bearer ' + clientToken
              },
              body : JSON.stringify({
                 phone : res.phone
              })
            })
            .then(data=>data.json())
            .then(data=>{
               AsyncStorage.setItem('isLogin', data.token);
            })
            .catch(err=>console.log(err));
          }
          
          if(!isSameToken){ // 디바이스 푸시토큰이 갱신되었을 경우 로직
            fetch(`${SSL_URL}/api/user/update/${res.unique}`,{
              method : 'PUT',
              headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization' : 'Bearer ' + clientToken
              },
              body : JSON.stringify({
                  push_token : expoToken
              })
            })
            .catch(err=>console.log(err))
          }
          
          setLogined(true);
          setTimeout(()=>{
            setIsLoaded(true);
          }, 1000)
        }
      })
      .catch(err=> console.log(err));
    }else{
      setLogined(false);
      setTimeout(()=>{
        setIsLoaded(true);
      }, 1000);
    }
  }

  const Stack = createStackNavigator();

  if(!isLoaded){
    return <AppLoading/>
  }else{
      return (
      <NavigationContainer>
          <Stack.Navigator
              initialRouteName = {logined ? 'Home' : 'LoginHome'}
              screenOptions={{
                  headerShown : false,
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
              }}
              mode="modal"
          >
            <Stack.Screen name = "Certification" component = {Certification} />
            <Stack.Screen name = "ChangePassword" component = {ChangePassword} />
            <Stack.Screen name = "Home" component = {Home} />
            <Stack.Screen name = "LoginHome" component = {LoginHome} />
            <Stack.Screen name = "Login" component = {Login} />
            <Stack.Screen name = "SignUp" component = {SignUp} />
            <Stack.Screen name = "SignUpCertification" component = {SignUpCertification} />    
            <Stack.Screen name = "OrderAddress" component = {OrderAddress} />
            <Stack.Screen name = "OrderCustomer" component = {OrderCustomer} />
            <Stack.Screen name = "OrderComplete" component = {OrderComplete} />
            <Stack.Screen name = "WithdrawInfo" component = {WithdrawInfo} />
            <Stack.Screen name = "CompleteWithdraw" component = {CompleteWithdraw} />
            <Stack.Screen name = "Settings" component = {Settings} />
            <Stack.Screen name = "Secession" component = {Secession} />
            <Stack.Screen name = "Push" component = {Push} />
            <Stack.Screen name = "Terms" component = {Terms} />
            <Stack.Screen name = "Privacy" component = {Privacy} />
          </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    const savedToken = await AsyncStorage.getItem('expoToken');
    
    if(savedToken !== token){
         isSameToken = false;
    }
    
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}




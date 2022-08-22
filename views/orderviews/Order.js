import React, {useState} from 'react';
import {useFocusEffect } from "@react-navigation/native";
import {SafeAreaView, StyleSheet, View, Text, BackHandler, Image, Dimensions} from 'react-native';
import {Header, CustomBtn} from '../components';

const {width, height} = Dimensions.get('window')

export default function Order({navigation, route}) {
    const btnOnClickLitener = ()=>{
        navigation.navigate('OrderAddress', {user : route});
    }
    

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {       
            BackHandler.exitApp();
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        })
    );


    return(
        <SafeAreaView style={styles.container}>
            <Header title={'도배신청'} useBackBtn={false}  />
            <View style = {styles.orderBox}>
                <View style={styles.logo}>
                     <Image source = {require('../../assets/icon2.png')} style={styles.logoImg} />
                </View>
                <Text style={styles.orderTxt}>도배신청만으로 {'\n'}공사비의 10% 페이백</Text>
                <CustomBtn title={'신청하러 가기'} btnOnClickLitener={btnOnClickLitener}/>
            </View>
        </SafeAreaView>
    );
} 

  
const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff',
        alignItems : 'center',
    },
    orderBox : {
        paddingVertical : 70,
        width : width - 100,
    },
    logo : {
        alignItems : 'center',
        marginTop : 15,
        marginBottom : 40,
    },
    orderTxt : {
        fontSize : 21,
        lineHeight : 33,
        color : '#4e4e4e',
        textAlign : 'center',
        marginBottom : 30
    },
    logoImg : {
        width : 230,
        height : 170
    }
})
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import {Header} from '../components';

export default function Terms({navigation}){
    let webview  =  null ; 
    return(
        <SafeAreaView style = {styles.container}>
            <Header title={"서비스 이용약관"} useBackBtn={true} useCloseBtn={true} navigation={navigation}/>
            <WebView
                ref = { ( ref )  => { ( webview  =  ref )} } 
                source={{ uri: 'https://smartpapering.com/terms/terms_of_use'}}
            />    
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff'
    },
    
})
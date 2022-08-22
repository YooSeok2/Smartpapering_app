import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import {Header} from '../components';

export default function Privacy({navigation}){
    let webview  =  null ; 
    return(
        <SafeAreaView style={styles.container}>
            <Header title={"개인정보 취급방침"} useBackBtn={true} useCloseBtn={true} navigation={navigation}/>
            <WebView
                ref = { ( ref )  => { ( webview  =  ref )} } 
                source={{ uri: 'https://smartpapering.com/terms/privacy'}}
            />    
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff'
    }
})
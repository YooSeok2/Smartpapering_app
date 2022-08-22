import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';


export default function CustomBtn({disabledBtn, title, btnOnClickLitener, customWidth, txtSize, customHeight, customStyle}){
    return(
        <TouchableOpacity 
            activeOpacity={disabledBtn ? 1 : 0.7} 
            style={[
                styles.loginBtn, 
                customWidth ? {width : customWidth}:{},
                customHeight ? {height : customHeight}:{height : 50},
                customStyle ? customStyle : {},
                disabledBtn ? styles.shadow : {}
                ]} 
            onPress={disabledBtn ? ()=>{} : btnOnClickLitener}
            
        >
            <Text style = {[txtSize ? {fontSize : txtSize }: {fontSize : 20}, styles.loginTxt]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    loginBtn : {
        backgroundColor : '#87c1fc',
        alignItems : 'center',
        justifyContent : 'center',
        padding : 10,
        // flex : 1
    },
    loginTxt : {
        color : '#ffffff'
    },
    shadow: { 
        backgroundColor: 'rgba(135, 193, 252, 0.6)'
    },


}) 
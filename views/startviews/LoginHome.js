import React, { Component } from 'react';
import {SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import {CustomBtn} from '../components'

const { height}  = Dimensions.get('window');

export default class LoginHome extends Component{
    
    render(){
        return(
        <SafeAreaView style={styles.container}>
            <View style = {styles.logo}>
                <Image source = {require('../../assets/login_logo.png')} style={styles.logoImg} />
            </View>
            <View style = {styles.btnBox}>
                <CustomBtn title="로그인" btnOnClickLitener={this.handleOnPressLoginBtn} />
                <Text style={styles.txt}>회원이 아니신가요?</Text>
                <TouchableOpacity activeOpacity={0.6} style={styles.registerBtn} onPress={this.handleOnPressSignUpBtn} >
                    <Text style = {styles.registerTxt}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView> 
        ); 
    }
       
    handleOnPressLoginBtn = () =>{
        const {navigation}  = this.props;
        
        navigation.navigate('Login');
    }

    handleOnPressSignUpBtn = ()=>{
        const {navigation}  = this.props;
        
        navigation.navigate('SignUpCertification', {name : 'signup'});
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection : 'column',
        justifyContent : 'center',
        backgroundColor : '#ffffff'
    },
    logo : {
        flex : 1,
        alignItems : 'center',
        paddingTop : height/6
    },
    btnBox : {
        flex : 1,
        paddingHorizontal : 30
    },
    loginBtn : {
        height : 50,
        backgroundColor : '#87c1fc',
        alignItems : 'center',
        justifyContent : 'center'
    },
    loginTxt : {
        fontSize : 20,
        color : '#ffffff'
    },
    txt : {
        marginTop : 20,
        fontSize : 14,
        color : '#808080',
        paddingHorizontal : 5
    },
    registerBtn : {
        height : 50,
        backgroundColor : '#ffffff',
        alignItems : 'center',
        justifyContent : 'center',
        borderColor : '#87c1fc',
        borderWidth : 1,
        marginTop : 7
    },
    registerTxt : {
        fontSize : 20,
        color : '#87c1fc'
    },
    logoImg : {
        width : 280,
        height : 280
    }
})
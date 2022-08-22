import React, {Component} from 'react';
import { CommonActions } from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View, Text, Dimensions, Pressable, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch } from 'react-native-paper';
import {debounce} from 'lodash';
import {SSL_URL, LOCAL_URL} from "@env";


const {width} = Dimensions.get('window');

export default class Settings extends Component{   
    constructor(props){
        super(props);
        const isSwitch = this.props.route.use_push;

        this.state = {
            isSwitchOn : isSwitch
        }
    } 
    

    render(){
        const {route} = this.props;
        const {isSwitchOn} = this.state;
        return(
            <SafeAreaView style={styles.container} >
                <View style={styles.contentBox} >
                    <View style={styles.viewBox}>
                        <Text style={styles.viewTitle}>알림설정</Text>
                        <View style={styles.alrmBox} >
                            <Text style={styles.menuTitle}>푸시알림설정</Text>
                            <Switch 
                                value={isSwitchOn} 
                                onValueChange={this.onToggleSwitch} 
                                color={'#87c1fc'}
                                style = {{marginTop : 5}}
                            />
                        </View>
                    </View>
                    <View style={styles.viewBox}>
                        <Text style={styles.viewTitle}>계정설정</Text>
                        <View style = {styles.settingBox}>
                            <Text style={styles.menuTitle}>이름</Text>
                            <Text style={styles.subMenuTitle}>{route.username}</Text>
                        </View>
                        <Pressable onPress={this.onClickChangePswBtn}>
                            <Text style={styles.menuTitle}>비밀번호 변경</Text>
                        </Pressable>
                    </View>
                    <View style={styles.lastViewBox}>
                        <Text style={styles.viewTitle}>기타</Text>
                        <Pressable onPress={this.onClickTermsBtn} style={styles.menu}>
                            <Text style={styles.menuTitle}>서비스 이용약관</Text>
                        </Pressable>
                        <Pressable onPress={this.onClickPrivacyBtn} style={styles.menu}>
                            <Text style={styles.menuTitle}>개인정보 취급방침</Text>
                        </Pressable>
                        <Pressable onPress={this.onClickLogoutBtn} style={styles.menu}>
                            <Text style={styles.menuTitle}>로그아웃</Text>
                        </Pressable>
                        <Pressable onPress={this.onClickSecessionBtn} style={styles.menu}>
                            <Text style={styles.menuTitle}>탈퇴하기</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    onClickPrivacyBtn = ()=>{
        const {navigation} = this.props;
        navigation.navigate('Privacy');
    }

    onClickTermsBtn = ()=>{
        const {navigation} = this.props;
        navigation.navigate('Terms');
    }

    onClickSecessionBtn = () =>{
        const {navigation, route} = this.props;
        navigation.navigate('Secession', {user : route});
    }
    
    onClickLogoutBtn =debounce( async() => {
        const {navigation, route} = this.props;
        const clientToken = await AsyncStorage.getItem('isLogin');
        fetch(`${SSL_URL}/api/user/update/${route.unique}`,{
            method : 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + clientToken
            },
            body : JSON.stringify({
                        islogin : false
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
            AsyncStorage.setItem('isLogin', '');
            navigation.dispatch(
                CommonActions.reset({
                    index : 1,
                    routes : [
                        {name : 'LoginHome'},
                    ]
                })
            )  
        })
        .catch(err=>console.log(err))
    }, 300)

    onClickChangePswBtn = ()=>{
        const {navigation, route} = this.props;
        navigation.navigate('Certification', {name : 'settings', ...route});
    }

    onToggleSwitch = async() => {
        const {route} = this.props;
        const {isSwitchOn}=this.state; 
        const clientToken = await AsyncStorage.getItem('isLogin');

        this.setState({
            isSwitchOn : !isSwitchOn
        },()=>{
           const isSwitch = this.state.isSwitchOn
            fetch(`${SSL_URL}/api/user/update/${route.unique}`,{
                method : 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' + clientToken
                },
                body : JSON.stringify({
                            use_push : isSwitch
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
        })
    }

}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
        alignItems : 'center'
    },
    contentBox : {
        width : width,
    },
    viewBox : {
        paddingVertical : 25,
        paddingHorizontal : 20,
        justifyContent : 'space-between',
        borderBottomWidth : 2,
        borderBottomColor : '#b1d6fb'
    },
    lastViewBox : {
        paddingVertical : 25,
        paddingHorizontal : 20,
        justifyContent : 'space-between',
    },
    viewTitle : {
        fontSize : 16,
        marginBottom : 15,
        color : '#808080',
        fontWeight : 'bold'
    },
    alrmBox : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    menuTitle : {
        fontSize : 18
    },
    subMenuTitle : {
        fontSize : 15,
        color : '#A9A9A9',
        marginTop : 2
    },
    settingBox : {
        marginBottom : 15
    },
    menu : {
        marginBottom : 15
    },
})
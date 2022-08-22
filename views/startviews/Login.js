import React, {Component} from 'react';
import {SafeAreaView, View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, Alert} from 'react-native';
import { CustomBtn, Header } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SSL_URL, LOCAL_URL} from '@env';
import {debounce} from 'lodash';

const {width} = Dimensions.get('window');

export default class Login extends Component{
    constructor(props){
        super(props);

        this.state = {
            IdUnderLineColor : '#dadada',
            PasswordUnderLineColor : '#dadada',
            userPhone : '',
            userPassword : ''
        }
    }

    render(){
        const {navigation} = this.props;
        const {IdUnderLineColor, PasswordUnderLineColor, userPhone, userPassword} = this.state;
        return(
            <SafeAreaView style={styles.container}>
                <Header title={'로그인'} useBackBtn={true} navigation={navigation}/>
                <View style = {styles.loginBox} >
                    <TextInput
                        style = {[styles.input, {borderBottomColor : IdUnderLineColor}]}
                        placeholder = "아이디 (휴대폰 번호)"
                        autoCorrect = {false}
                        keyboardType = 'number-pad'
                        maxLength = {14}
                        selectionColor = '#87c1fc'
                        value = {userPhone}
                        returnKeyType="next"
                        onChangeText = {this._controllUserId}
                        onFocus = {()=>this.onTextInputFocus('id')}
                        onBlur = {()=>this.onTextInputBlur('id')}              
                    />

                    <TextInput
                        style = {[styles.input,  {borderBottomColor : PasswordUnderLineColor}]}
                        placeholder = "비밀번호"
                        autoCorrect = {false}
                        secureTextEntry = {true}
                        selectionColor = '#87c1fc'
                        value ={userPassword}
                        onChangeText = {this._controllUserPassword}
                        onFocus = {()=>this.onTextInputFocus('psw')}
                        onBlur = {()=>this.onTextInputBlur('psw')} 
                    />
                    <CustomBtn title="시작하기" btnOnClickLitener={this.onClickStartBtn} />
                    <Text style={styles.txt}>비밀번호를 잊으셨나요?</Text>
                    <TouchableOpacity activeOpacity={0.6} style={styles.registerBtn} onPress={this.handleOnPressChangePassword} >
                        <Text style = {styles.registerTxt}>비밀번호 찾기</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    _controllUserId=text=>{
        this.setState({userPhone : text})
    }
    _controllUserPassword=text=>{
        this.setState({userPassword : text})
    }

    onClickStartBtn = debounce(()=>{
        const {navigation} = this.props;
        const {userPassword, userPhone} = this.state;
        fetch(`${SSL_URL}/api/user/login`,{
            method : 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                        phone : userPhone,
                        password : userPassword,
                    })
        })
        .then(res=>res.json())
        .then(res=>{
            if(!res.result){
                if(res.message === 'id'){
                    Alert.alert("",
                        "아이디가 잘못되었습니다.",[
                            {
                                text : '확인'
                            }
                        ]
                    )
                }else{
                    Alert.alert("",
                        "비밀번호가 잘못되었습니다.",[
                        {
                            text : '확인'
                        }
                     ]
                    )
                }
            }else{
                AsyncStorage.setItem('isLogin', res.token);
                AsyncStorage.setItem('unique', res.unique);
                navigation.navigate('Home')
            }
        })
        .catch(err=>console.log(err));
    },200)

    onTextInputFocus = (identifier)=>{
        if(identifier === 'id'){
            this.setState({
                IdUnderLineColor : '#87c1fc'
            })
        }else{
            this.setState({
                PasswordUnderLineColor : '#87c1fc'
            })
        }
    }

    onTextInputBlur = (identifier) =>{
        if(identifier === 'id'){
            this.setState({
                IdUnderLineColor : '#dadada'
            })
        }else{
            this.setState({
                PasswordUnderLineColor : '#dadada'
            })
        }
    }

    handleOnPressChangePassword = ()=>{
        const {navigation} = this.props;
        navigation.navigate('Certification', {name : 'login'});
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff',
        alignItems : 'center',
    },
    loginBox : {
        paddingVertical : 60
    },
    input : {
        width : width-50,
        paddingVertical : 10,
        fontSize : 17,
        borderColor : 'white', 
        borderWidth : 1,
        marginBottom : 40
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
    txt : {
        marginTop : 20,
        fontSize : 14,
        color : '#808080',
        paddingHorizontal : 5
    },
})
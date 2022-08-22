import React from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput,Alert} from 'react-native';
import CustomBtn  from './CustomBtn';
import {SendSms} from '../../apis/sms';
import {Auth} from '../../prototypes/auth';
import ValidationComponent from 'react-native-form-validator';
import {SSL_URL, LOCAL_URL} from '@env';
import { CommonActions } from '@react-navigation/native';
import {debounce} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

export default class CertificationBox extends ValidationComponent{
    constructor(props){
        super(props);
        this.state = {
            phoneFocusStyle : {},
            numFocusStyle : {},
            isVaild : true,
            phoneVal : '',
            times : '',
            disabledBtn : false,
            authDisabled : true,
            authNumVal : '',
            randomNum : ''
        }
    }

    componentWillUnmount(){
        clearInterval(this.timer);
        clearTimeout(this.disabledTimer);
    }

    render(){
        const {phoneFocusStyle, numFocusStyle, isVaild, phoneVal, times,disabledBtn, authDisabled, authNumVal} = this.state;
        return(
            <>
               <View style={styles.inputNumBox}>
                        <TextInput
                            style = {[styles.input, {...phoneFocusStyle}]}
                            placeholder = "휴대폰 번호 입력"
                            autoCorrect = {false}
                            keyboardType = 'number-pad'
                            maxLength = {14}
                            selectionColor = '#87c1fc'
                            value = {phoneVal}
                            onChangeText = {this._controlPhoneNum}
                            onFocus = {()=>this.onTextInputFocus('phone')}
                            onBlur = {()=>this.onTextInputBlur('phone')}              
                        />
                        {this.isFieldInError('phoneVal') || !isVaild
                            ?
                            <Text style={styles.fixPhone}>휴대폰 번호를 올바르게 입력해주세요</Text>
                            :
                            <Text style={styles.phoneInfo}>(­­ - ) 하이픈 없이 입력해주세요.</Text>
                        }
                </View>                   
                <CustomBtn disabledBtn={disabledBtn} title={'인증문자 받기'} btnOnClickLitener={this.onClickGetAuthBtn} />
                <View style = {[styles.finalAuthBox, {...numFocusStyle}]}>
                    <TextInput
                        style = {styles.numInput}
                        placeholder = "인증번호 입력"
                        autoCorrect = {false}
                        keyboardType = 'number-pad'
                        maxLength = {6}
                        selectionColor = '#87c1fc'
                        value = {authNumVal}
                        onChangeText = {this._controllAuthNum}
                        onFocus = {()=>this.onTextInputFocus('num')}
                        onBlur = {()=>this.onTextInputBlur('num')}              
                    />
                    <Text style={styles.times}>{times}</Text>
                </View>
                <CustomBtn disabledBtn={authDisabled} title={'인증완료'} btnOnClickLitener={this.onClickFinalBtn} /> 
            </>
        )
    }

    _clearAuthProcess = ()=>{
        clearInterval(this.timer);
        clearTimeout(this.disabledTimer);
        this.setState({
            times : "",
            randomNum : ""
        });
    }

    _controlPhoneNum = text => {
        this.setState({
            phoneVal : text
        })
    }

    _controllAuthNum = text =>{
        this.setState({
            authNumVal : text
        })
    }

    createAuthCallBackAlert = ()=>{
        Alert.alert(
            "",
            "인증번호가 만료 되었습니다.",
            [{
                text : "확인",
                style : 'cancel'
            }]
        )
    }

    onClickGetAuthBtn = async() => {
        this._clearAuthProcess();
        const {phoneVal} = this.state;
        const checkValidation = this.validate({
            phoneVal : {
                required : true,
                numbers : true
            }
        })
        const isVailded = Auth.phone_validater(phoneVal);
        if(isVailded && checkValidation){
            const randomnum = Auth.randomNum();  
            let comSecond = 180;

            this.setState({
                isVaild : true,
                disabledBtn : true,
                randomNum : randomnum,
                authDisabled : false
            },()=>{this.disabledTimer=setTimeout(()=>{this.setState({disabledBtn:
                false})},10000)})

            this.timer = setInterval(()=>{
                let time = Auth.fnTimer(comSecond)
                comSecond--;
                if(comSecond < 0){
                    this._clearAuthProcess();
                    this.createAuthCallBackAlert();
                }
                this.setState({
                    times : time
                });
            }, 1000)
            
            // 서버용
            const status = await SendSms(phoneVal, randomnum);

            if(status === 'error'){
                this._clearAuthProcess();
                Alert.alert(
                    "",
                    "인증번호 발송에 문제가 발생하였습니다 잠시 후 다시 시도해주세요.",
                    [{
                        text : "확인",
                        style : 'cancel'
                    }]
                )
            }

        }else{
            this.setState({
                isVaild : false
            })
        }
    }

    isValidationOwner = (target)=>{
        const route = target.route
        if(target.phoneVal === route.phone){
            this._clearAuthProcess();
            return target.navigation.navigate(target.navigate, {...route});
        }else{
            return Alert.alert("",
                    "본인 계정의 휴대폰번호를 입력해주세요.",
                    [
                        {
                            text : '확인'
                        }
                    ]
                )
        }
    }


    onClickFinalBtn = debounce(async()=>{
        const {navigation, route} = this.props;
        
        const {randomNum, authNumVal, phoneVal} = this.state;
        
        // 서버용
        if(parseInt(randomNum) === parseInt(authNumVal)){
            this._clearAuthProcess()
            const clientToken = await AsyncStorage.getItem('isLogin');
            switch(route.name){
                case 'mypoint' :
                    this.isValidationOwner({
                        navigation : navigation,
                        route : route, 
                        navigate : 'WithdrawInfo',
                        phoneVal : phoneVal
                    });
                    break;
                case 'login' :
                    fetch(`${SSL_URL}/api/user/`)
                    .then(res=>res.json())
                    .then(res=>{
                        if(!res.result){
                            this._clearAuthProcess();
                            Alert.alert(
                                "",
                                "서버와의 통신이 원할하지 않습니다. 잠시 후 다시 시도해주세요.",
                                [{
                                    text : '확인'
                                }]
                            )
                        }else{
                            const users = res.data;
                            for(let loop = 0; loop < users.length; loop++){
                                if(users[loop].phone === phoneVal){
                                    this._clearAuthProcess();
                                    navigation.navigate('ChangePassword', {unique : users[loop].unique});
                                    break;
                                }else{
                                    if(users.length-1 === loop){
                                        this._clearAuthProcess();
                                        Alert.alert(
                                            "",
                                            "등록되지 않은 사용자입니다.",
                                            [{
                                                text : '확인'
                                            }]
                                        )
                                    }
                                }
                            }
                        }
                    
                    })
                    .catch(err=>{
                        this._clearAuthProcess();
                        console.log(err);
                    })
                    break;
                case 'settings' :
                    this.isValidationOwner({
                        navigation : navigation,
                        route : route, 
                        navigate : 'ChangePassword',
                        phoneVal : phoneVal
                    });
                    break;
                case 'signup' :
                    fetch(`${SSL_URL}/api/user/special?phone=`+phoneVal)
                    .then(res=>res.json())
                    .then(res=>{
                        if(!res.result){
                            this._clearAuthProcess();
                            return navigation.navigate('SignUp',{phone : phoneVal})
                        }else{
                            this._clearAuthProcess();
                            Alert.alert("",
                                "이미 등록되어있는 휴대폰 번호입니다.",[
                                    {
                                        text : '확인'
                                    }
                                ]
                        ) 
                        }
                    })
                    .catch(err=>{
                        this._clearAuthProcess();
                        console.error(err);
                    })
                    break;
                case 'secession' :
                    fetch(`${SSL_URL}/api/user/delete/${route.unique}`,{
                        method: 'DELETE',
                        headers: {
                            'Authorization' : 'Bearer ' + clientToken
                        }
                    })
                    .then(res=>res.json())
                    .then(res=>{
                        if(!res.result){
                            Alert.alert("",
                                "서버에 문제가 생겼습니다. 잠시 후 다시 시도해주세요.",
                                [
                                    {
                                        text : '확인'
                                    }
                                ]
                            )
                        }else{
                            Alert.alert("",
                                "정상적으로 탈퇴되었습니다.",
                                [
                                    {
                                        text : '확인',
                                        onPress : ()=>{
                                            AsyncStorage.setItem('isLogin', '');
                                            
                                            fetch(`${SSL_URL}/api/push/deletepushs/${route.push_token}`,{
                                                method: 'DELETE'
                                            })
                                            .catch(err=>console.log(err));

                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index : 1,
                                                    routes : [
                                                        {name : 'LoginHome'},
                                                    ]
                                                })
                                            )
                                        }
                                    }
                                ]
                            )
                           
                        }
                    })
                    .catch(err=>console.log(err));
                    break;
                default : 
                    return; 
            }
        }else{
            Alert.alert(
                "",
                "인증번호가 올바르지 않습니다.",
                [{
                    text : "확인",
                    style : 'cancel'
                }]
            )
        }
        
    }, 300)


    onTextInputFocus = (identifier)=>{
        if(identifier === 'phone'){
            this.setState({
                phoneFocusStyle : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }else{
            this.setState({
                numFocusStyle : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }
    }

    onTextInputBlur = (identifier) =>{
        if(identifier === 'phone'){
            this.setState({
                phoneFocusStyle : {}
            })
        }else{
            this.setState({
                numFocusStyle : {}
            })
        }
    }
}

const styles = StyleSheet.create({
    title : {
        fontSize : 20
    },
    input : {
        width : width-50,
        padding : 10,
        fontSize : 17,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginBottom : 5
    },
    numInput : {
        width : width-50,
        padding : 10,
        fontSize : 17,
    },
    fixPhone : {
        fontSize : 11,
        color : 'red',
        marginLeft : 5,
        marginBottom : 5, 
    },
    finalAuthBox : {
        width : width-50,
        position : 'relative',
        borderColor : '#dadada', 
        borderWidth : 1,
        marginTop : 30,
        marginBottom : 15,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    inputNumBox : {
        marginBottom : 10
    },
    times : {
        position : 'absolute',
        right : 0,
        color : '#808080',
        marginRight : 10
    },
    phoneInfo : {
        marginBottom : 5, 
        marginLeft : 5, 
        color:'#808080', 
        fontSize:11
    }
})


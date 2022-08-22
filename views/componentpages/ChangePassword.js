import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Dimensions, SafeAreaView, Alert, BackHandler, ToastAndroid} from 'react-native';
import {Header, CustomBtn} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationComponent from 'react-native-form-validator';
import {Validate} from '../../prototypes/validate'
import { CommonActions } from '@react-navigation/native';
import {SSL_URL, LOCAL_URL} from '@env';
import {debounce} from 'lodash';

const {width} = Dimensions.get('window');
 
export default class ChangePassword extends ValidationComponent {
    constructor(props){
        super(props);
        this.state = {
            pswFocusStyle : {},
            newPswFocusStyle : {},
            modalVisible : false,
            password : '',
            confirmPsw : '',
            isVaild : true
        }
    }

    onBackPress = () => {       
        ToastAndroid.show('비밀번호 변경 진행 중에는 뒤로 갈 수 없습니다.', ToastAndroid.SHORT);
        return true;
    };

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    render(){
        const {pswFocusStyle, newPswFocusStyle, password, confirmPsw, isVaild} = this.state
        
        return(
            <SafeAreaView style={styles.container}> 
                <Header title='비밀번호 변경' useBackBtn={false} />
                <View style={styles.contentBox}>
                    <TextInput
                        style = {[styles.input, {...pswFocusStyle, marginBottom : 5}]}
                        placeholder = "새 비밀번호 입력"
                        autoCorrect = {false}
                        secureTextEntry = {true}
                        maxLength = {15}
                        selectionColor = '#87c1fc'
                        onFocus = {()=>this.onTextInputFocus('psw')}
                        onBlur = {()=>this.onTextInputBlur('psw')}    
                        value = {password}  
                        onChangeText = {this._controllPassword}        
                    />
                     {!isVaild || this.isFieldInError('password') 
                        ? <Text style={styles.validateTxt}>영문, 숫자, 특수문자를 모두 포함하여 6~15자</Text> 
                        : <Text style={styles.pswRule}>영문, 숫자, 특수문자를 모두 포함하여 6~15자</Text>}
                    
                    <TextInput
                        style = {[styles.input, {...newPswFocusStyle, marginBottom : 5}]}
                        placeholder = "새 비밀번호 재입력"
                        autoCorrect = {false}
                        secureTextEntry = {true}
                        maxLength = {15}
                        selectionColor = '#87c1fc'
                        onFocus = {()=>this.onTextInputFocus('newpsw')}
                        onBlur = {()=>this.onTextInputBlur('newpsw')}  
                        value = {confirmPsw}           
                        onChangeText = {this._controllConfirmPsw}   
                    /> 
                    {this.isFieldInError('confirmPsw') 
                        ? <Text style={[styles.validateTxt, {marginBottom:15}]}>"비밀번호"와 같은 값을 입력하세요</Text> 
                        : <Text style={{marginBottom:5}}></Text>}
                <CustomBtn
                    title = {'변경'}
                    btnOnClickLitener= {this.createButtonAlert}
                />
                </View>
            </SafeAreaView>
        )
    }

    _controllPassword = text=>{
        this.setState({password : text})
    }

    _controllConfirmPsw = text=>{
        this.setState({confirmPsw : text})
    }

    createButtonAlert = debounce(()=>{
        const {password} = this.state;
        const {route} = this.props;
        const unique = route.params.unique;
        
        const checkValidate = this.validate({
            password : {
                required : true,
                minlength : 6,
                maxlength : 15
            },
            confirmPsw : {
                required : true,
                equalPassword : password
            }
        })
        const checkPswd = Validate.password_validate(password);
        if(checkPswd){
            this.setState({isVaild : true})
            if(checkValidate){
                fetch(`${SSL_URL}/api/user/updateforpassword/${unique}`,{
                    method : 'PUT',
                    headers: {
                         Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body : JSON.stringify({
                        password : password
                    })
                })
                .then(res=>res.json())
                .then(res=>{
                    if(!res.result){
                        Alert.alert(
                            "",
                            "비밀번호를 변경하실 수 없습니다. 잠시 후 다시 시도해주세요.",[
                                {
                                    text : "확인",
                                }
                            ]
                        )
                    }else{
                        Alert.alert(
                            "비밀번호 변경 완료",
                            "변경된 비밀번호로 로그인하실 수 있습니다.",[
                                {
                                    text : "로그인하러 가기",
                                    onPress : async()=>{
                                        const {navigation} = this.props;
                                        const clientToken = await AsyncStorage.getItem('isLogin');
                                        fetch(`${SSL_URL}/api/user/update/${unique}`,{
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
                                        })
                                        .catch(err=>console.log(err));
                                        setTimeout(()=>{
                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index : 1,
                                                    routes : [
                                                        {name : 'LoginHome'},
                                                    ]
                                                })
                                            )
                                        },300)
                                    }
                                }
                            ]
                        )
                    }
                })
                .catch(err=>{
                    console.log(err);
                    Alert.alert(
                        "",
                        "서버 문제로 비밀번호를 변경할 수 없습니다.",[
                            {
                                text : '확인'
                            }
                        ]
                    )
                })
                
                
            }
        }else{
            this.setState({isVaild : false})
        }
       
    }, 300)

    onTextInputFocus = (identifier)=>{
        if(identifier === 'psw'){
            this.setState({
                pswFocusStyle : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }else{
            this.setState({
                newPswFocusStyle : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }
    }

    onTextInputBlur = (identifier) =>{
        if(identifier === 'psw'){
            this.setState({
                pswFocusStyle : {}
            })
        }else{
            this.setState({
                newPswFocusStyle : {}
            })
        }
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        backgroundColor : '#ffffff'
    },
    contentBox : {
        paddingVertical : 25
    },
    title : {
        fontSize : 20
    },
    input : {
        width : width-50,
        padding : 10,
        fontSize : 17,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginTop : 20
    },
    pswRule : {
        fontSize : 11,
        color : '#808080',
        fontWeight : "100",
        marginTop : 5,
        marginLeft : 5
    },
    validateTxt : {
        color : 'red',
        fontSize : 11,
        marginLeft : 5
    }
})


import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, Dimensions, TextInput, Alert, BackHandler, ToastAndroid, Platform} from 'react-native';
import { Header, CustomBtn} from '../components';
import ValidationComponent from 'react-native-form-validator';
import {Validate} from '../../prototypes/validate'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SSL_URL, LOCAL_URL} from "@env";
import {debounce} from 'lodash';


const {width} = Dimensions.get('window');

export default class SignUp extends ValidationComponent{
    constructor(props){
        super(props)
        this.state = {
            nameFocusStyle : {},
            pswFocusStyle : {},
            newPswFocusStyle : {},
            username : '',
            invalidTxt : '',
            password : '',
            confirmPsw : '',
            psdValid : true,
            exit : false,
            completed : false
        }
    }

    onBackPress = () => {
        ToastAndroid.show('회원가입 진행 중에는 뒤로 갈 수 없습니다.', ToastAndroid.SHORT);
        return true;
    };

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    render(){
        const {navigation} = this.props;
        const {nameFocusStyle, pswFocusStyle, newPswFocusStyle, username, password,confirmPsw, psdValid, completed} = this.state;
        return(
            <SafeAreaView style={styles.container}>
                <Header title={'회원정보 입력'} useBackBtn={false} navigation={navigation} />
                <View style={styles.contentBox}>
                    <TextInput
                        style = {[styles.input, {...nameFocusStyle}]}
                        placeholder = "이름(성+이름) 입력"
                        autoCorrect = {false}
                        maxLength = {10}
                        selectionColor = '#87c1fc'
                        onFocus = {()=>this.onTextInputFocus('name')}
                        onBlur = {()=>this.onTextInputBlur('name')}
                        value = {username}
                        onChangeText = {this._controllUsername}              
                    />
                    {this.isFieldInError('username')
                        ? 
                        <Text style={[styles.validateTxt]}>이름을 정확히 입력해주세요</Text>
                        :
                        <Text style={[styles.txtRule]}></Text>
                    }
                    <TextInput
                        style = {[styles.pswInput, {...pswFocusStyle}]}
                        placeholder = "비밀번호 입력"
                        autoCorrect = {false}
                        secureTextEntry = {true}
                        maxLength = {15}
                        selectionColor = '#87c1fc'
                        onFocus = {()=>this.onTextInputFocus('psw')}
                        onBlur = {()=>this.onTextInputBlur('psw')}     
                        value = {password}  
                        onChangeText = {this._controllPassword}           
                    />
                    {!psdValid || this.isFieldInError('password') 
                        ? <Text style={styles.validateTxt}>영문, 숫자, 특수문자를 모두 포함하여 6~15자</Text> 
                        : <Text style={[styles.txtRule]}>영문, 숫자, 특수문자를 모두 포함하여 6~15자</Text>}
                    <TextInput
                        style = {[styles.input, {...newPswFocusStyle, marginBottom : 5}]}
                        placeholder = "비밀번호 재입력"
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
                        ? <Text style={[styles.validateTxt, {marginBottom : 10}]}>"비밀번호"와 같은 값을 입력하세요</Text> 
                        : <Text style={{marginBottom : 5}} ></Text>}
                    <CustomBtn
                        title = {'회원가입 완료'}
                        btnOnClickLitener= {this.onClickFinalBtn}
                        disabledBtn={completed}
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

    _controllUsername = text =>{
        this.setState({username : text})
    }

    onClickFinalBtn = debounce(async()=>{
        const {password, username} = this.state;
        const {route} = this.props;
        const phoneVal = route.params.phone;
        
        const checkValidate = this.validate({
            password : {
                required : true,
                minlength : 6,
                maxlength : 15
            },
            confirmPsw : {
                required : true,
                equalPassword : password
            },
            username : {
                required :true,
                minlength : 2,
                maxlength : 15
            }
        })
    
        const checkPswd = Validate.password_validate(password)
        
        if(checkPswd){
            this.setState({psdValid : true})     
            if(checkValidate){
                const expoToken = await AsyncStorage.getItem('expoToken');
                this.setState({completed : true})
                fetch(`${SSL_URL}/api/user/signup`,{
                    method : 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body : JSON.stringify({
                                username : username,
                                password : password,
                                phone : phoneVal,
                                push_token : expoToken
                            })
                })
                .then((res)=>res.json())
                .then((res)=>{
                    if(res){
                        fetch(`${SSL_URL}/api/user/special?phone=${phoneVal}`)
                        .then(res=>res.json())
                        .then(res=>{
                            Alert.alert(
                                "회원가입 완료",
                                "가입하신 정보로 로그인하실 수 있습니다.",[
                                    {
                                        text : "로그인하러 가기",
                                        onPress : ()=>{
                                            const {navigation} = this.props;
                                            const teletxt = "***신규회원***"+'\n'+username+"님이 도배GO APP을 통해 회원가입하였습니다."+"\n"+'-연락처: '+phoneVal;

                                            fetch(`${SSL_URL}/api/push/telebot`,{
                                                method : 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json'
                                                },
                                                body : JSON.stringify({
                                                    text : teletxt
                                                })
                                            }).catch(err=>console.log(err));

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
                        })
                    }
                })
                .catch(err=>{
                    Alert.alert(
                        "",
                        "서버와의 통신이 원할하지 않습니다. 잠시 후 다시 시도해주세요."+err,[
                            {
                                text : "확인",
                                onPress : ()=>{
                                    this.setState({completed : false})
                                }
                            }
                        ]
                    )
                })
            }
        }else{
            this.setState({psdValid : false})
        }
      
    }, 300)

    onTextInputFocus = (identifier)=>{
        if(identifier === 'name'){
            this.setState({
                nameFocusStyle : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }else if(identifier === 'psw'){
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
        if(identifier === 'name'){
            this.setState({
                nameFocusStyle : {}
            })
        }else if(identifier === 'psw'){
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
        paddingVertical : 20,
    },
    input : {
        width : width-50,
        padding : 10,
        fontSize : 17,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginTop : 15,
        marginBottom : 5
    },
    pswInput : {
        width : width-50,
        padding : 10,
        fontSize : 17,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginBottom : 5,
        marginTop : 10
    },
    txtRule : {
        fontSize : 11,
        color : '#808080',
        fontWeight : "100",
        marginLeft : 5
    },
    validateTxt : {
        color : 'red',
        fontSize : 11,
        marginLeft : 5
    }
})
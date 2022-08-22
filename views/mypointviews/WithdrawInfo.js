import React from "react";
import {SafeAreaView, StyleSheet, Dimensions,View, Text, TextInput, BackHandler, Alert, ToastAndroid} from 'react-native';
import {Header, CustomBtn} from '../components';
import { Ionicons } from '@expo/vector-icons'; 
import RNPickerSelect from 'react-native-picker-select';
import {bankList} from '../../datas/bankList';
import ValidationComponent from 'react-native-form-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SSL_URL, LOCAL_URL} from '@env'
import {debounce} from 'lodash';

const {width} = Dimensions.get('window');

export default class WithdrawInfo extends ValidationComponent {
    constructor(props){
        super(props);
        this.state ={
            bank : '',
            accountFocusStyle : {},
            nameFocusStyle : {},
            accountNum : '',
            customerName : '',
            completed : false
        }
    }
    onBackPress = () => {
        ToastAndroid.show('출금신청 진행 중에는 뒤로 갈 수 없습니다.', ToastAndroid.SHORT);
        return true;
    };

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    render(){
        const {bank, accountFocusStyle, nameFocusStyle, accountNum, customerName, completed} = this.state

        const placeholder = {
            label: '은행을 선택해주세요',
            value: null,
            color: '#9EA0A4',
          };
        return(
            <SafeAreaView style={styles.container}>
                <Header title={'출금정보입력'} useBackBtn={false}  />
                <View style={styles.contentBox}> 
                    <RNPickerSelect
                            placeholder={placeholder}
                            items={bankList}
                            onValueChange={this.SelectBankChangeVal}
                            style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 10,
                                right: 12,
                            },
                            }}
                            value={bank}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={{ underlineColor: 'yellow' }}
                            Icon={() => {
                                return <Ionicons name="md-arrow-down" size={24} color="gray" />;
                            }}
                    />
                    <TextInput
                        style = {[styles.accountInput, {...accountFocusStyle}]}
                        placeholder = '계좌번호 입력'
                        autoCorrect = {false}
                        keyboardType = 'number-pad'
                        maxLength = {20}
                        value = {accountNum}
                        onChangeText = {this._controllAccountNum}
                        selectionColor = '#87c1fc'
                        onFocus = {()=>this.onTextInputFocus('accont')}
                        onBlur = {()=>this.onTextInputBlur('accont')}      
                    />
                     {this.isFieldInError('accountNum') 
                        ? <Text style={[styles.validateTxt,{marginBottom:10}]}>계좌번호가 올바르지 않습니다.</Text> 
                        : <Text ></Text>}
                    <TextInput
                        style = {[styles.input, {...nameFocusStyle}]}
                        placeholder = '예금주 명'
                        autoCorrect = {false}
                        maxLength = {14}
                        value= {customerName}
                        onChangeText = {this._controllName}
                        selectionColor = '#87c1fc'
                        onFocus = {()=>this.onTextInputFocus('name')}
                        onBlur = {()=>this.onTextInputBlur('name')}      
                    />
                    {this.isFieldInError('accountNum') 
                        ? <Text style={[styles.validateTxt, {marginBottom:15}]}>예금주명을 입력해주세요.</Text> 
                        : <Text style={{marginBottom:5}}></Text>}
                    <CustomBtn title={'완료'} btnOnClickLitener={this.onClickFinallBtn} disabledBtn={completed}/>
                </View>
            </SafeAreaView>
        );
    }

    // textinput 값 변화 시 로직 함수들
    _controllAccountNum = text => {
        this.setState({
            accountNum : text
        })
    }

    SelectBankChangeVal = text =>{
        this.setState({bank : text})
    }

    _controllName = text => {
        this.setState({customerName : text})
    }

    numberWithCommas=(num)=>{
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    

    onClickFinallBtn = debounce(async()=>{
        const {accountNum, customerName, bank} = this.state;
        const {pgPoint} = this.props.route.params;
        const commaPrice = this.numberWithCommas(pgPoint);
        
        const checkValidate = this.validate({
        
            accountNum : {
                required : true
            },
            customerName : {   
                required : true
            }
        })
        

        if(checkValidate){
            const clientToken = await AsyncStorage.getItem('isLogin');
            this.setState({completed : true});
            Alert.alert(
                "출금정보확인",
                `${bank}\n${accountNum}\n${commaPrice}원\n${customerName}\n\n위의 출금 정보가 맞나요?`,[
                    {
                        text : '아니요',
                        onPress : ()=>{
                            this.setState({completed : false});
                        }
                    },
                    {
                        text : '네, 맞습니다',
                        onPress : ()=>{
                            const {navigation, route} = this.props;
                            const user = route.params;
                            fetch(`${SSL_URL}/api/withdraw/`,{
                                method : 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization' : 'Bearer ' + clientToken
                                },
                                body : JSON.stringify({
                                            bank : bank,
                                            account_holder : customerName,
                                            withdraw_price : pgPoint,
                                            account_num : accountNum, 
                                            user_phone : user.phone,
                                            user_id : user.unique,
                                            user_name : user.username
                                        })
                            })
                            .then(res=>res.json())
                            .then(res=>{
                                if(!res.result){
                                    Alert.alert("",
                                        "출금정보가 올바르지 않습니다.",
                                        [
                                            {
                                                text : '확인',
                                                onPress : ()=>{
                                                    this.setState({completed : false});
                                                }
                                            }
                                        ]
                                    )
                                }else{
                                    const leftPoint = parseInt(user.point) - parseInt(pgPoint);
                                    fetch(`${SSL_URL}/api/user/update/${user.unique}`,{
                                        method : 'PUT',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type' : 'application/json',
                                            'Authorization' : 'Bearer ' + clientToken
                                        },
                                        body : JSON.stringify({
                                                    point : leftPoint
                                                })
                                    })
                                    .then(res=>res.json())
                                    .then(res=>{
                                        if(!res.result){
                                            Alert("",
                                            "네트워크 통신이 원할하지 않습니다. 잠시 후 다시 시도해주세요.",
                                            [
                                                {
                                                    text :"확인"
                                                }
                                            ]
                                            )
                                        }else{
                                            const teletxt = user.username+"님의 출금이 접수되었습니다."+'\n'+"*출금정보*"+'\n'+
                                            "은행명: "+bank+'\n'+"출금금액: "+pgPoint+'\n'+"예금주: "+customerName+'\n'+"자세한 사항은 CMS에서 확인하세요.";

                                            fetch(`${SSL_URL}/api/push/withdrawtele`,{
                                                method : 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json'
                                                },
                                                body : JSON.stringify({
                                                    text : teletxt
                                                })
                                            }).catch(err=>console.log(err));
                                            navigation.navigate('CompleteWithdraw');
                                        } 
                                    })
                                    .catch(err=>{
                                        console.log(err);
                                    })
                                }
                            })
                            .catch(err=>console.log(err));
                        }
                    }
                ]
            )
            
        }
    }, 500)


    // textinput에 포커싱, blur시 로직함수
    onTextInputFocus = (identifier)=>{
        if(identifier === 'account'){
            this.setState({
                accountFocusStyle : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }else{
            this.setState({
                nameFocusStyle : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }
    }

    onTextInputBlur = (identifier) =>{
       if(identifier === 'account'){
            this.setState({
                accountFocusStyle : {}
            })
        }else{
            this.setState({
                nameFocusStyle : {}
            })
        }
    }

    
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 14,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderWidth: 0.5,
      borderColor: 'grey',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
        alignItems : "center"
    },
    contentBox : {
        paddingVertical : 35
    },
    accountInput : {
        width : width-50,
        padding : 10,
        fontSize : 17,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginTop : 30,
        marginBottom : 5,
    },
    input : {
        width : width-50,
        padding : 10,
        fontSize : 17,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginBottom : 5,
    },
    validateTxt : {
        color : 'red',
        fontSize : 12,
        marginLeft : 5
    }
})
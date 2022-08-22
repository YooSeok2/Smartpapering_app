import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, Dimensions,TextInput,Alert} from 'react-native';
import { Header, CustomProgress, CustomBtn } from '../components';
import ValidationComponent from 'react-native-form-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SSL_URL, LOCAL_URL} from '@env'
import {debounce} from 'lodash';

const {width} = Dimensions.get('window')

export default class OrderCustomer extends ValidationComponent{
    constructor(props){
        super(props);
        this.state = {
            nameUnderLineColor : {},
            phoneUnderLineColor : {},
            customerName : '',
            customerPhone : '',
            completed : false
        }
    }
    render(){
        const {navigation} = this.props
        const {nameUnderLineColor, phoneUnderLineColor, customerName, customerPhone, completed} = this.state;
        return(
            <SafeAreaView style = {styles.container}>
                <Header title={'도배신청 - 고객주소'} useBackBtn={true} navigation={navigation} />
                <View style={styles.orderBox}>
                    <CustomProgress completed={true} />
                    <Text style={styles.title}>시공하시는 고객님의 정보를 {'\n'} 입력해주세요.</Text>
                    <TextInput
                        style = {[styles.input, {...nameUnderLineColor}]}
                        placeholder = "고객 이름"
                        autoCorrect = {false}                          
                        selectionColor = '#87c1fc'
                        maxLength = {10}
                        onFocus = {()=>this.onTextInputFocus('name')}
                        onBlur = {()=>this.onTextInputBlur('name')}  
                        editable = {true}
                        value = {customerName} 
                        onChangeText = {this._controllCustomerName}          
                    />
                    {this.isFieldInError('customerName') 
                        ? <Text style={[styles.validateTxt,{marginBottom:10}]}>고객의 이름을 입력해주세요.</Text> 
                        : <Text ></Text>}
                    <TextInput
                        style = {[styles.input, {...phoneUnderLineColor}]}
                        placeholder = "고객 연락처"
                        autoCorrect = {false}                          
                        selectionColor = '#87c1fc'
                        keyboardType = 'number-pad'
                        maxLength = {15}
                        onFocus = {()=>this.onTextInputFocus('phone')}
                        onBlur = {()=>this.onTextInputBlur('phone')}  
                        editable = {true}  
                        value = {customerPhone}
                        onChangeText = {this._controllCustomerPhone}         
                    />
                    {this.isFieldInError('customerPhone') 
                        ? <Text style={[styles.validateTxt,{marginBottom:15}]}>고객의 연락처를 올바르게 입력해주세요.</Text> 
                        : <Text style={styles.phoneInfo}>(­­ - ) 하이픈 없이 입력해주세요.</Text>}
                    <CustomBtn title={'완료'} btnOnClickLitener={this.onClickCompleteBtn} disabledBtn={completed}/>
                </View>  
            </SafeAreaView>
        )
    }

    _controllCustomerName = text => {
        this.setState({customerName : text})
    }

    _controllCustomerPhone = text => {
        this.setState({customerPhone : text})
    }

    onClickCompleteBtn = debounce(async()=>{
        const checkValidation = this.validate({
            customerName : {
                required : true
            },
            customerPhone : {
                required : true,
                numbers : true,
                minlength : 10
            }
        })

        if(checkValidation){
            const { route } = this.props;
            const {customerName, customerPhone} = this.state;
            const clientToken = await AsyncStorage.getItem('isLogin')
            this.setState({completed : true});

            Alert.alert(
                "주문정보확인",
                `${route.params.address}\n${route.params.detailAddr}\n${customerName}\n${customerPhone}\n\n위의 정보가 맞나요?`,[
                    {
                        text : '아니요',
                        onPress : ()=>{
                            this.setState({completed : false});
                        }
                    },
                    {
                        text : '네, 맞습니다',
                        onPress : ()=>{
                            const {navigation} = this.props;
                            fetch(`${SSL_URL}/api/order`,{
                                method : 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization' : 'Bearer ' + clientToken
                                },
                                body : JSON.stringify({
                                            place : route.params.address+" "+route.params.detailAddr,
                                            customer_name : customerName,
                                            customer_telephone : customerPhone,
                                            order_id : route.params.unique,
                                            user_name : route.params.username,
                                            user_phone : route.params.phone
                                        })
                            })
                            .then(res=>res.json())
                            .then(res=>{
                                if(!res.result){
                                    Alert.alert("",
                                        "서버에 문제가 생겨 주문 접수가 안됩니다. 잠시 후 다시 시도해주세요.",
                                        [
                                            {
                                                text : '확인'
                                            }
                                        ]
                                    )
                                }else{
                                    const teletxt = route.params.username+"님의 시공이 접수되었습니다."+'\n'+"*시공정보*"+'\n'+
                                    "고객명: "+customerName+'\n'+"고객연락처: "+customerPhone+'\n'+"자세한 사항은 CMS에서 확인하세요.";

                                    fetch(`${SSL_URL}/api/push/ordertele`,{
                                        method : 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                        body : JSON.stringify({
                                            text : teletxt
                                        })
                                    }).catch(err=>console.log(err));
                                    navigation.navigate('OrderComplete');
                                }
                            });
                        }
                    }
                ]
            )
        }
    }, 400)

    onTextInputFocus = (identifier)=>{
        if(identifier === 'name'){
            this.setState({
                nameUnderLineColor : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }else{
            this.setState({
                phoneUnderLineColor : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }
    }
    
    onTextInputBlur = (identifier) =>{
        if(identifier === 'name'){
            this.setState({
                nameUnderLineColor : {}
            })
        }else{
            this.setState({
                phoneUnderLineColor : {}
            })
        }
    }
}



const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff',
        alignItems : 'center',
    },
    orderBox : {
        paddingVertical : 30,
        width : width - 100,
    },
    title : {
        fontSize : 18,
        marginTop : 10,
        marginBottom : 25,
        textAlign : 'center',
        lineHeight : 30,
        color :  '#1d1d1f'
    },
    input : {
        width : width - 100,
        padding : 10,
        fontSize : 15,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginRight : 10,
        marginBottom : 5
    },
    validateTxt : {
        color : 'red',
        fontSize : 11,
        marginLeft : 5
    },
    phoneInfo : {
        marginBottom : 15, 
        marginLeft : 5, 
        color:'#808080', 
        fontSize:11
    }
  
})
import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, Dimensions, TextInput} from 'react-native';
import { Header, CustomProgress, CustomBtn, CustomModal } from '../components';
import ValidationComponent from 'react-native-form-validator';


const {width} = Dimensions.get('window')

export default class OrderAddress extends ValidationComponent{
    constructor(props){
        super(props);
        this.state = {
            addrUnderLineColor : {},
            detailUnderLineColor : {},
            modalVisible : false,
            address : '',
            detailAddr : ''
        }
    }
    render(){
        const {navigation} = this.props;
        const {addrUnderLineColor, detailUnderLineColor, modalVisible, address, detailAddr} = this.state
        return(
            <SafeAreaView style = {styles.container}>
                <Header title={'도배신청 - 시공주소'} useBackBtn={true} navigation={navigation}/>
                <View style={styles.orderBox}>
                    <CustomProgress completed={false}  />
                    <Text style={styles.title}>시공할 곳의 주소를 자세히 {'\n'} 입력해주세요.</Text>
                    <View style={styles.findAddress}>
                        <TextInput
                            style = {[styles.addrInput, {...addrUnderLineColor}]}
                            placeholder = "주소 입력"
                            autoCorrect = {false}                          
                            selectionColor = '#87c1fc'
                            onFocus = {()=>this.onTextInputFocus('addr')}
                            onBlur = {()=>this.onTextInputBlur('addr')}  
                            editable = {true}
                            value = {address}
                            onChangeText = {this._controllAddr}            
                        />
                        <CustomBtn title={'주소찾기'}  customWidth={70} txtSize={13} btnOnClickLitener={this.onClickSearchAddrBtn}/>
                        <CustomModal visible ={modalVisible} btnClick={this.onClickModalBtn} type= {'address'} modalHeight= {400} handleComplete={this.handleComplete}/>
                    </View>
                    {this.isFieldInError('address') 
                        ? <Text style={[styles.validateTxt,{marginBottom:10}]}>주소를 입력해주세요.</Text> 
                        : <Text ></Text>}
                    <TextInput
                            style = {[styles.detailInput, {...detailUnderLineColor}]}
                            placeholder = "상세주소 입력"
                            autoCorrect = {false}
                            selectionColor = '#87c1fc'
                            value = {detailAddr}
                            onChangeText = {this._controllDetailAddr}
                            onFocus = {()=>this.onTextInputFocus('detail')}
                            onBlur = {()=>this.onTextInputBlur('detail')}              
                        />
                    {this.isFieldInError('detailAddr') 
                        ? <Text style={[styles.validateTxt,{marginBottom:10}]}>상세주소를 입력해주세요.</Text> 
                        : <Text style={{marginBottom : 10}} ></Text>}
                    <CustomBtn title={'다음'} btnOnClickLitener={this.onClickNextBtn}/>
                </View>
             
            </SafeAreaView>
        )
    }

    _controllAddr = text => {
        this.setState({address : text})
    }

    _controllDetailAddr =text=>{
        this.setState({detailAddr : text})
    }

    handleComplete = (data) => {
        this.setState({modalVisible : false, address : data.address});  
    }

    onClickSearchAddrBtn = ()=>{
        this.setState({
            modalVisible : true
        });
    }

    onClickModalBtn = ()=>{
        this.setState({
            modalVisible : false,
            address : ''
        });
    }

    onClickNextBtn = ()=>{

        const checkValidation = this.validate({
            address : {
                required : true
            },
            detailAddr : {
                required : true
            }
        })

        if(checkValidation){
            const {address, detailAddr} = this.state;
            const {navigation, route} = this.props;
            const user = route.params.user;
            navigation.navigate('OrderCustomer', {address : address, detailAddr : detailAddr, ...user});
        }
        
    }

    onTextInputFocus = (identifier)=>{
        if(identifier === 'addr'){
            this.setState({
                addrUnderLineColor : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }else{
            this.setState({
                detailUnderLineColor : {borderBottomColor : '#87c1fc', borderBottomWidth : 2}
            })
        }
    }
    
    onTextInputBlur = (identifier) =>{
        if(identifier === 'addr'){
            this.setState({
                addrUnderLineColor : {}
            })
        }else{
            this.setState({
                detailUnderLineColor : {}
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
        width : width - 50,
    },
    title : {
        fontSize : 18,
        marginTop : 10,
        marginBottom : 25,
        textAlign : 'center',
        lineHeight : 30,
        color :  '#1d1d1f'
    },
    findAddress : {
        flexDirection : 'row',
        marginBottom : 5,
        justifyContent : 'space-between',
        
    },
    addrInput : {
        flex: 3,
        padding : 10,
        fontSize : 15,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginRight : 10,
        color : '#1d1d1f'
    },
    detailInput : {
        width : width - 50,
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
    }

})
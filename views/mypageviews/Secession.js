import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Header, CustomBtn} from '../components';


export default function Secession({navigation, route}){
    const onClickNoBtn = ()=>{
        navigation.goBack();
    }
    
    const onClickSecessionBtn =()=>{
            const user = route.params.user
            navigation.navigate('Certification', {name : 'secession', ...user});  
    }

    return(
        <SafeAreaView style={styles.container}>
            <Header title={'탈퇴하기'} />
            <View style = {styles.contentBox}>
                <View style = {styles.titleBox}>
                    <Text style={styles.title}>회원 탈퇴</Text>
                    <Text style={styles.subtitle}>SmartPapering회원 탈퇴 시 {'\n'} 다음 사항을 확인해 주세요.</Text>
                </View>
                <View style={styles.mainBox}>
                    <Text style={styles.mainTitle}>1.회원탈퇴 시 처리내용</Text>
                    <Text style={styles.mainTxt}>사용자 정보 : 스크랩정보{'\n'}당사 사이트 이용권한 : 도배 신청, 거래 내역 조회,{'\n'}SmartPapering포인트 출금 권한</Text>
                    <Text style={styles.mainTxt}>회원탈퇴 시 당사 사이트에 신청하신 거래기록(도배신청 정보, 거래내역)은 삭제되지 않으며 다음기간동안 보관 후 파기됩니다.</Text>
                    <Text style={styles.mainTxt}>전자상거래 등에서의 소비자보호에 관한 법률 시행령 제6조(사업자가 보존하는 거래기록의 대상 등)에 의거.</Text>
                    <Text style={styles.mainTxt}>표시·광고에 관한 기록 : 6개월{'\n'}계약 또는 청약철회 등에 관한 기록 : 5년{'\n'}대금결제 및 재화등의 공급에 관한 기록 : 5년{'\n'}소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</Text>
                    <Text style={styles.oneMoreConfirm}>정말 회원을 탈퇴하시겠습니까?</Text>
                </View>
                <View style={styles.btnBox}>
                    <TouchableOpacity activeOpacity={0.6} style={styles.registerBtn} onPress={onClickNoBtn} >
                        <Text style = {styles.registerTxt}>아니요, 안할래요</Text>
                    </TouchableOpacity>
                    <CustomBtn title={'탈퇴하겠습니다'} txtSize={15} customStyle={{flex : 1}} btnOnClickLitener={onClickSecessionBtn}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white'
    },
    contentBox : {
        paddingVertical : 25
    },
    titleBox : {
        paddingBottom : 20,
        borderBottomColor : '#b1d6fb',
        borderBottomWidth : 2,
        alignItems : 'center'
    },
    title : {
        fontSize : 20,
        fontWeight : '600',
        marginBottom : 10
    },
    subtitle : {
        fontSize : 13,
        color : '#1d1d1f',
        fontWeight : '100',
        lineHeight : 18
    },
    mainTitle : {
        marginTop : 20,
        fontSize : 16,
        marginBottom : 10
    },
    mainBox : {
        paddingHorizontal : 30
    },
    mainTxt : {
        fontSize : 13,
        color : '#808080',
        marginBottom : 10,
        lineHeight : 18,
        marginLeft : 10
    },
    oneMoreConfirm : {
        textAlign :'center',
        fontSize : 16,
        marginTop : 5,
    },
    btnBox : {
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        paddingHorizontal : 30,
        marginTop : 20
    },
    registerBtn : {
        height : 50,
        backgroundColor : '#ffffff',
        alignItems : 'center',
        justifyContent : 'center',
        borderColor : '#87c1fc',
        borderWidth : 1,
        padding : 10,
        flex : 1,
        marginRight : 10
    },
    registerTxt : {
        fontSize : 15,
        color : '#87c1fc'
    },
})
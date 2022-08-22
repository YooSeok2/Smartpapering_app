import React from 'react';
import {useFocusEffect, CommonActions} from "@react-navigation/native"
import {SafeAreaView, View, Text, StyleSheet, Dimensions, BackHandler} from 'react-native';
import {Header, CustomProgress, CustomBtn} from '../components';

const {width} = Dimensions.get('window');

export default function OrderComplete({navigation}) {

    const onClickBackBtn = async() => {
   
 
        navigation.dispatch(
            CommonActions.reset({
                index : 1,
                routes : [
                    {name : 'Home'},
                ]
            })
        )
    }

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => true
      
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
            return () =>
              BackHandler.removeEventListener('hardwareBackPress', onBackPress);
          })
    )

    return(
        <SafeAreaView style={styles.container}>
            <Header title = {'도배신청 - 완료'} useBackBtn={false} />
            <View style={styles.orderBox}>
                <CustomProgress completed={true} />
                <Text style={styles.title}>도배신청이 {'\n'} 완료되었습니다.</Text>
                <Text style={styles.subTitle}>마이페이지에서 실시간으로 시공현황을 {`\n`} 확인하실 수 있습니다.</Text>
                <CustomBtn title={'돌아가기'} btnOnClickLitener={onClickBackBtn}/>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff',
        alignItems : 'center'
    },
    orderBox : {
        paddingVertical : 80,
        width : width - 100,
    },
    title : {
        fontSize : 24,
        marginVertical : 30,
        textAlign : 'center',
        lineHeight : 35,
        color :  '#1d1d1f'
    },
    subTitle : {
        fontSize : 15,
        marginBottom : 50,
        textAlign : 'center',
        lineHeight : 22,
        color :  '#1d1d1f'
    }
})
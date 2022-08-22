import React from 'react';
import {useFocusEffect, CommonActions} from "@react-navigation/native"
import {SafeAreaView, StyleSheet, Dimensions, Text, View, BackHandler} from 'react-native';
import {Header, CustomBtn} from '../components';

const {width} = Dimensions.get('window');

export default function CompleteWithdraw({navigation}) {
    const onClickBackBtn = () =>{
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
            <Header title= {'출금 완료'} useBackBtn={false} />
            <View style= {styles.orderBox}>
                <Text style={styles.title}>출금신청이 {'\n'} 완료되었습니다.</Text>
                <Text style={styles.subTitle}>평일 기준 1일 ~ 3일 정도 {`\n`} 소요될 수 있습니다.</Text>
                <CustomBtn title={'돌아가기'} btnOnClickLitener={onClickBackBtn}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
        alignItems : 'center'
    },
    orderBox : {
        paddingVertical : 80,
        width : width - 100,
    },
    title : {
        fontSize : 25,
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
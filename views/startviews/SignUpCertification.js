import React, {Component} from 'react';
import {SafeAreaView, View, Text, StyleSheet, Dimensions} from 'react-native';
import {Header, CertificationBox} from '../components';
import { MaterialIcons } from '@expo/vector-icons';


const {width} = Dimensions.get('window');

export default class SignUpCertification extends Component{
 
    render(){
        const {navigation, route} = this.props;
        
        return(
            <SafeAreaView style={styles.container}>
                <Header title={'회원가입'} useBackBtn={true} navigation={navigation} />
                <View style = {styles.contentBox}>
                    <View style={styles.introBox}>
                        <MaterialIcons name="security" size={90} color="#87c1fc" />
                        <Text style={styles.introTxt}>도배GO에서는 {'\n'}휴대폰 번호로 가입합니다.{'\n'}번호는 안전하게 보관되며{'\n'}절대 공개되지 않습니다.</Text>
                    </View>
                    <CertificationBox navigation={navigation} route={route.params} />
                </View>
            </SafeAreaView>   
        )
    }

}

const styles = StyleSheet.create({
    container : {
      flex : 1,
      alignItems : 'center',
      backgroundColor : '#ffffff'
    },
    contentBox : {
        paddingVertical : 25,
    },
    introBox : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
        marginBottom : 30
    },
    introTxt : {
        marginLeft : 25,
        lineHeight : 19,
        color : '#404040'
    },
    input : {
        width : width-50,
        padding : 10,
        fontSize : 17,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginBottom : 20
    },
    numInput : {
        width : width-50,
        padding : 10,
        fontSize : 17,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginTop : 50,
        marginBottom : 20
    }
})
import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import {Header, CertificationBox}  from '../components';



const {width} = Dimensions.get('window');

export default class Certification extends Component {
    render(){
        const {navigation, route} = this.props
        return(
            <SafeAreaView style={styles.container}>
                <Header title="본인 인증" useBackBtn={true} navigation={navigation} />
                <View style={styles.contentBox}>
                    <CertificationBox navigation = {navigation} route={route.params}/>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff',
        alignItems : 'center'
    },
    title : {
        fontSize : 20
    },
    contentBox : {
        paddingVertical : 40
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
        
        padding : 10,
        fontSize : 17,
    },
    fixPhone : {
        fontSize : 12,
        color : 'red',
        marginLeft : 5
    },
    finalAuthBox : {
        width : width-50,
        borderColor : '#dadada', 
        borderWidth : 1,
        marginTop : 40,
        marginBottom : 20,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    inputNumBox : {
        marginBottom : 10
    },
    times : {
        
        color : '#808080',
        marginRight : 10
    }
})


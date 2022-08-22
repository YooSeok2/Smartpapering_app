import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import {Header} from '../components'
import Setting from './Settings';

const {width} = Dimensions.get('window');

export default class MyPage extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }


    render(){
        const {navigation, route} = this.props;
        
        return(
            <SafeAreaView style={styles.container}>
                <Header title={"마이페이지"} useBackBtn={false} route={route} navigation={navigation}/>
                <Setting navigation={navigation} route={route}/>
            </SafeAreaView>
        )
    }
    
  

 
}


const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff',
    },
    orderBox : {
        width : width,
        height : 70,
        paddingHorizontal : 50,
        justifyContent : 'center'
    },
    title : {
        fontSize : 18,
        marginBottom : 5,
        marginTop : 20
    },
    tabbar : {
        backgroundColor:"#ffffff",
        borderBottomColor : "#b1d6fb", 
        borderBottomWidth : 5, 
        paddingVertical : 10, 
        paddingHorizontal: 40
    }
})
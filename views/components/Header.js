import React from 'react';
import {View, Text, StyleSheet, Pressable, Dimensions} from 'react-native';
import { MaterialCommunityIcons, Ionicons, AntDesign} from '@expo/vector-icons'; 

const {width} = Dimensions.get('window');

export default function Header({title, useBackBtn, navigation, route, useCloseBtn}){

    const clickBackBtnLitener = ()=> {
            return navigation.goBack()
    }

    const onClickSettingBtn = (title) =>{
        navigation.navigate('Push', {user : route}) 
    }

    return (
        useBackBtn 
        ?  
            useCloseBtn
            ?
            <View style = {styles.mypageCont}>
                <Text style = {styles.title}>{title}</Text>
                <Pressable onPress={()=>clickBackBtnLitener()}>
                    <AntDesign name="close" size={27} color="white" style={styles.closeIcon}/>
                </Pressable>
            </View>
            :
            <View style = {styles.container}>
                <Pressable onPress={()=>clickBackBtnLitener()}>
                    <Ionicons name="arrow-back" size={27} color="white" style={styles.icon}/>
                </Pressable>
                <Text style = {styles.title}>{title}</Text>
            </View>
        :
            title === '마이페이지'
            ?
            <View style = {styles.mypageCont}>
                <Text style = {styles.title}>{title}</Text>
                <Pressable onPress={()=>onClickSettingBtn(title)}>
                        <MaterialCommunityIcons name="bell" size={23} color="white" />
                </Pressable>
                
            </View>
            :
            <View style = {styles.container}>
                <Text style = {styles.title}>{title}</Text>
            </View>
    )
}



const styles = StyleSheet.create({
    container : {
        width : width,
        height : 90,
        backgroundColor : "#87c1fc",
        paddingHorizontal : 15,
        paddingVertical : 10,
        flexDirection : 'row',
        alignItems : 'flex-end',
        justifyContent : 'flex-start',
        paddingRight : 20
    },
    mypageCont : {
        width : width,
        height : 90,
        backgroundColor : "#87c1fc",
        paddingHorizontal : 15,
        paddingVertical : 10,
        flexDirection : 'row',
        alignItems : 'flex-end',
        justifyContent : 'space-between',
        paddingRight : 20
    },
    title : {
        color : '#ffffff',
        fontSize : 21
    },
    icon : {
        marginRight : 15
    },
    closeIcon : {
        textAlign : 'right'
    }
})
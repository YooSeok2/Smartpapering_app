import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons'; 


const {width}= Dimensions.get('window')

export default function CustomProgress({completed}){
    const [progress, setProgress] = useState(0);

    useEffect(()=>{
        let timeout;
        if(completed){
            timeout = setTimeout(()=>{
                setProgress(1);
            },500)
        }else{
            timeout = setTimeout(()=>{
                setProgress(0.5);
            },500)
        }
        return ()=> clearTimeout(timeout);
    })
    
    return(
    <View style={styles.progressBox}>
        <View style = {styles.leftBar}>
            <FontAwesome name="circle-o" size={15} color="#87c1fc" />
            <Text style={styles.leftBarTxt}>주소</Text>
        </View>
        <ProgressBar progress={progress} color= {'#87c1fc'} style={styles.progress}  />
        <View style = {styles.rightBar}>
            <FontAwesome name="circle-o" size={15} color="#87c1fc" style={completed ? {opacity : 1} : {opacity : 0.5}} />
            <Text style={[styles.rightBarTxt,completed ? {opacity : 1} : {opacity : 0.5}]}>고객정보</Text>
        </View>
    </View>
    )
} 

const styles = StyleSheet.create({
    progressBox : {
        flexDirection : 'row',
        justifyContent : 'center',
    },
    leftBar : {
        alignItems : 'center',
        width : 50
    },
    rightBar : {
        alignItems : 'center',
        width : 50
    },
    leftBarTxt : {
        color : '#87c1fc',
        fontSize : 11,
        marginTop : 5,
        fontWeight : 'bold'
    },
    rightBarTxt : {
        color : '#87c1fc',
        fontWeight : 'bold',
        fontSize : 11,
        marginTop : 5,
    },
    progress : {
        width : width-140,
        height : 10,
        borderRadius : 15,
    }
})
import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import Postcode from 'react-native-daum-postcode';
import { AntDesign } from '@expo/vector-icons'; 


const {width, height} = Dimensions.get('window');

export default function CustomModal({visible, btnClick, type, modalHeight, handleComplete}){
    
    const renderContent = () => {
        switch(type){
            case 'address' :
                return (
                    <>
                    <Pressable onPress={btnClick} style ={styles.modalClose}>
                        <AntDesign name="close" size={24} color="black" />
                    </Pressable>
                    <View style={[styles.container, modalHeight ? {height : modalHeight} : {height : 200, paddingHorizontal : 20, paddingTop : 30}]}> 
                        <Postcode
                            style = {{width:width-60, height : modalHeight}}
                            jsOptions ={{animated : true}}
                            onSelected={(data)=>handleComplete(data)}
                        />
                    </View>
                    </>
                )
            default :
                return;
        }
    }
    return(
        <Modal 
            isVisible = {visible} 
            useNativeDriver={true} 
            style={styles.modal} 
            backdropOpacity={0.2} 
            avoidKeyboard={false}
        >
            {renderContent()}
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal : {
        flex : 1,
        position : 'absolute',
        top: '15%',
        left: '2%',
    },
    container : {
        width : width-50,
        justifyContent : 'flex-end',
        backgroundColor : 'white',
        borderRadius : 10,
        paddingBottom: 20
    },
    txtBox : {
        alignItems : 'center',
        justifyContent : 'center',
        marginBottom : 20
    },
    txt : {
        fontSize : 20,
        textAlign : 'center',
        lineHeight : 25,
    },
    subtxt : {
        fontSize : 12,
        marginTop : 10
    },
    modalClose : {
        marginTop : 10,
        alignItems : 'flex-end',
        paddingHorizontal : 10
    }
})
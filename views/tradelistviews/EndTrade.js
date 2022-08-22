import React from 'react';
import {FlatList, StyleSheet, Dimensions, RefreshControl, View, Text, Image} from 'react-native';

const {width, height} = Dimensions.get('window');

export default function EndTrade({statusArray, endOrders, refreshing, onRefresh}){
    const renderStatus = (status)=>{
        const sameStatus = statusArray.filter(ele=>{
            return ele.status === status;
        })
        
        if(sameStatus.length > 0){
            switch(sameStatus[0].status){
                case '시공완료' :
                    return (
                        <View style={styles.statusBox}>
                            <Image source = {require(`../../assets/check.png`)} style={styles.logoImg} />
                            <Text style={[styles.status, {color : sameStatus[0].color}]}>{sameStatus[0].status}</Text>
                        </View>
                    )
                case '거래취소' :
                    return (
                        <View style={styles.statusBox}>
                            <Image source = {require(`../../assets/multiply.png`)} style={styles.logoImg} />
                            <Text style={[styles.status, {color : sameStatus[0].color}]}>{sameStatus[0].status}</Text>
                        </View>
                    );
                default : break;
            }
        }else{
            return(
                <View style={styles.statusBox}>
                    <Image source = {require(`../../assets/check.png`)} style={styles.logoImg} />
                    <Text style={styles.status}>{status}</Text>
                </View>
            ) 
        }
    }
    
    const renderItem=({item})=>{ 
        return(
            <View style={styles.tradeBox}>
                {renderStatus(item.status)}
                <View style={styles.statusDetail}>
                    <Text style={styles.statusTitle}>고객성함 : </Text>
                    <Text style={styles.name}>{item.customer_name}</Text>
                </View>
                <View style={styles.statusDetail}>
                    <Text style={styles.statusTitle}>완료일 : </Text>
                    <Text style={styles.date}>{item.updatedAt}</Text>    
                </View>
            </View>
        );
    }
    
    return(
        <FlatList
            style = {styles.tradeList}
            data={endOrders}
            showsVerticalScrollIndicator={false}
            renderItem = {renderItem}
            keyExtractor={(item)=>item.ordernum}
            refreshControl = {
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent = {()=>{
                return(
                    <View style={styles.noTradeBox}>
                        <Text style={styles.noTrade}>거래한 내역이 없습니다</Text>
                    </View>
                )
            }}
            numColumns = {2}
        />
    )
}

const styles = StyleSheet.create({
    tradeList : {
        backgroundColor : '#f4f4f4',
        paddingHorizontal : 5,
        paddingVertical : 5
    },
    tradeBox : {
        width : (width/2)-15,
        paddingVertical : 18,
        alignItems : 'center',
        padding : 5,
        height : 150,
        margin : 5,
        backgroundColor : '#ffffff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    noTradeBox : {
        justifyContent : 'center',
        alignItems : 'center',
        height : height/2,
        width : width
    },
    noTrade : {
        fontSize : 20,
        color : '#c4c4c4'
    },
    status : {
        textAlign : 'center',
        flex : 1.5,
        fontSize : 16,
        fontWeight : '900'
    },
    name : {
        textAlign : 'center',
        flex : 1,
        fontSize : 15
    },
    date : {
        textAlign : 'center',
        flex : 1.5,
        fontSize : 15
    },
    logoImg : {
        width : 45,
        height : 45
    },
    statusBox : {
        flexDirection :'row',
        paddingHorizontal : 10,
        alignItems : 'center',
        justifyContent : 'center',
        marginBottom : 15
    },
    statusTitle : {
        color : '#808080'
    },
    statusDetail : {
        flexDirection : 'row',
        paddingHorizontal : 10,
        alignItems : 'center',
        justifyContent : 'center',
        marginTop : 5
    }
})
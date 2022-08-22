import React from 'react';
import {FlatList, StyleSheet, Dimensions, RefreshControl, View, Text, Image} from 'react-native';

const {width, height} = Dimensions.get('window');

export default function PgWithdraw({statusArray, endWithdraws, refreshing, onRefresh}){
    const numberWithCommas = (val)=>{ //세번째자리마다 콤마찍어서 리턴
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const renderStatus = (status)=>{
        const sameStatus = statusArray.filter(ele=>{
            return ele.status === status;
        })

        if(sameStatus.length > 0){
            return (
                <View style={styles.statusBox}>
                    <Image source = {require(`../../assets/withdraw.png`)} style={styles.logoImg} />
                    <Text style={[styles.status, {color : sameStatus[0].color}]}>출금{sameStatus[0].status}</Text>
                </View>
            );
        }else{
            return (
                <View style={styles.statusBox}>
                    <Image source = {require(`../../assets/withdraw.png`)} style={styles.logoImg} />
                    <Text style={styles.status}>출금{status}</Text>
                </View>
            )
        }
    }

    const renderItem=({item})=>{ 
        return(
            <View style={styles.withdrawBox}>
                {renderStatus(item.status)}
                <View style={styles.statusDetail}>
                    <Text style={styles.statusTitle}>예금주 : </Text>
                    <Text style={styles.name}>{item.account_holder}</Text>
                </View>
                <View style={styles.statusDetail}>
                    <Text style={styles.statusTitle}>출금금액 : </Text>
                    <Text style={styles.price}>{numberWithCommas(item.withdraw_price)}</Text>    
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
            style = {styles.withdrawList}
            data={endWithdraws}
            showsVerticalScrollIndicator={false}
            renderItem = {renderItem}
            keyExtractor={(item)=>item.ordernum}
            refreshControl = {
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent = {()=>{
                return(
                    <View style={styles.noWithdrawBox}>
                        <Text style={styles.noWithdraw}>완료된 출금이 없습니다</Text>
                    </View>
                )
            }}
            numColumns={2}
        />
    )
}

const styles = StyleSheet.create({
    withdrawList : {
        backgroundColor : '#f4f4f4',
        paddingHorizontal : 5,
        paddingVertical : 5
    },
    withdrawBox : {
        width : (width/2)-15,
        paddingVertical : 18,
        alignItems : 'center',
        padding : 5,
        height : 170,
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
    noWithdrawBox : {
        justifyContent : 'center',
        alignItems : 'center',
        height : height/2,
        width : width
    },
    noWithdraw : {
        fontSize : 20,
        color : '#c4c4c4'
    },
    status : {
        textAlign : 'center',
        flex : 1.5,
        fontSize : 17,
        fontWeight : '900'
    },
    price : {
        textAlign : 'right',
        flex : 1,
        fontSize : 15
    },
    name : {
        textAlign : 'right',
        flex : 1,
        fontSize : 15
    },
    date : {
        textAlign : 'right',
        flex : 1.5,
        fontSize : 15
    },
    logoImg : {
        width : 50,
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
import React, {useEffect, useState, useCallback} from 'react';
import {Header} from '../components';
import {SafeAreaView, StyleSheet, FlatList, Dimensions, RefreshControl, View,Text, Alert, Image} from 'react-native';
import {SSL_URL, LOCAL_URL} from "@env";
import moment from 'moment';

const {width, height} = Dimensions.get('window');

export default function Push({navigation, route}){
    const [pushs, setPushs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(()=>{
        
        getPushsData();   
    },[])

    const renderItem = ({item})=>{
        return(
            <View style={styles.pushBox}>
                <View style={styles.pushSubBox}>
                    <Image source = {require(`../../assets/push-icon.png`)} style={styles.logoImg} />
                    <View style={styles.pushCont}>
                        <Text style={{fontSize : 14.5}}>{item.title}</Text>
                        <Text style={styles.pushBody}>{item.body}</Text>
                        <Text style={styles.pushDate}>{item.createdAt}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const onRefresh = useCallback(()=>{
        setRefreshing(true);
        getPushsData();
    });

    const getPushsData = async()=>{
        const userToken = route.params.user.push_token
        if(userToken){
            fetch(`${SSL_URL}/api/push/getpushs/${userToken}`)
            .then(res=>res.json())
            .then(res=>{
                if(!res.result){
                    console.log('푸시들 조회하는데 문제 생김');
                }else{
                    const newPushs = res.data.map(item=>{
                        const newDate = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                        const newObj = {
                            ...item,
                            createdAt : newDate
                        }
                        return newObj;
                    })
                    setPushs(newPushs);
                }
            })
            .catch(err=>console.log(err));
        }else{
            Alert.alert(
                "",
                "서버와의 통신이 원할하지 않습니다. 잠시 후 다시 시도해주세요.",
                [{
                    text : '확인'
                }]
            )
        }
        setRefreshing(false);
    }

    return(
        <SafeAreaView style={styles.container}>
            <Header title={'알림'} useBackBtn={true} navigation={navigation}/>
            <FlatList
                style = {styles.tradeList}
                data={pushs}
                showsVerticalScrollIndicator={false}
                renderItem = {renderItem}
                keyExtractor={(item)=>'push'+item.id}
                refreshControl = {
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent = {()=>{
                    return(
                        <View style={styles.noTradeBox}>
                            <Text style={styles.noTrade}>알림 내역이 없습니다</Text>
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#f4f4f4'
    },
    noTradeBox : {
        justifyContent : 'center',
        alignItems : 'center',
        height : height/2,
        width : width
    },
    tradeList : {
        backgroundColor : '#ffffff',
        marginTop : 10,
        width : width
    },
    noTrade : {
        fontSize : 20,
        color : '#c4c4c4'
    },
    pushBox : {
        width : width,
        paddingVertical : 13,
        borderBottomColor : '#f4f4f4',
        borderBottomWidth : 1.5,
    },
    pushCont : {
        justifyContent : 'space-between',
        
    },
    pushSubBox : {
        paddingHorizontal : 15,
        flexDirection : 'row',
        alignItems : 'center',
        width : width -50
    },
    pushDate : {
        fontSize : 12.5,
        color : '#a2a2a2',
    },
   
    logoImg : {
        width : 40,
        height : 40,
        borderRadius : 40,
        marginRight : 15
    },
    pushBody :{
        fontSize : 13.5, 
        color : '#494949'
    }
})
import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const GetStarted = ({navigation}) => (
    <View style={styles.getStartedContainer}>
        <View>
            <View style={{alignItems: 'center'}}>
                <Image
                    source={require('../../resources/icons/app.png')}
                    style={styles.logo}
                />
                <Text style={styles.titleText}>Your social media accounts in one place.</Text>
                <Text style={styles.subText}>
                    We make it easy to manage your social media accounts. Just add a couple of accounts to see how we bring your social media contents into one place.
                </Text>
            </View>
            <TouchableOpacity 
                style={styles.buttonContainer}
                onPress={()=>navigation.navigate('Accounts')}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default GetStarted;

const styles = StyleSheet.create({
    getStartedContainer:{
        flex:1, 
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent: 'center',
        padding: 30,
    },
    logo:{
        height:100, 
        width:100,
    },
    buttonContainer:{
        backgroundColor: Theme.THEME_COLOR, 
        paddingVertical:10,
        marginTop: 20,
    }, 
    buttonText:{
        textAlign:'center',
        color:'#FFF',
        fontWeight: '700',
    },
    titleText:{
        fontSize:18, 
        fontWeight:'bold', 
        paddingVertical:10
    },
    subText:{
        color:'#7f8c8d'
    }
})

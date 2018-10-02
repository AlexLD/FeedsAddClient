import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image} from 'react-native';
import {DrawerItems} from 'react-navigation';
import theme from '../../styles/theme';
import { connect } from 'react-redux';
import { logoutAction } from '../../actions/logoutAction';

class DrawerContent extends React.Component{
    constructor(props){
        super(props);
    }
    logout =()=>{
        this.props.logout();
        this.props.navigation.navigate('Login');
    }
    render(){
        const {items, ...restProps} = this.props;
        return (
            <ScrollView>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('Home')}>
                    <View
                        style={styles.logoContainer}>
                        <Image
                            source={require('../../resources/icons/header.png')}
                            style={{width:50, height:50}}
                        />
                    </View>
                </TouchableOpacity>
                <DrawerItems items={items} {...restProps}/>    
                <TouchableOpacity style={{marginLeft:0, marginTop:0, height:50}} onPress={this.logout}>
                    <Text style={{fontWeight:'bold', fontSize:15, marginLeft:16, marginTop:6}}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    logoContainer:{
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingTop: StatusBar.currentHeight + 15,
        justifyContent:'center',
    }
})

export default connect(null,{logout: logoutAction})(DrawerContent);
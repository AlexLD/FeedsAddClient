import React from 'react';
import { Header, Left, Right, Body, Icon } from 'native-base';
import { TouchableOpacity, Image } from 'react-native';
import Theme from '../../styles/theme';

export default class AppHeader extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Header style={{height:90, marginBottom:-20, backgroundColor:Theme.THEME_COLOR}}>
                <Left style={{flexDirection:'row'}}>
                    <TouchableOpacity>
                        <Icon name='md-menu' style={{color:"#FFFFFF"}} onPress={()=>this.props.navigation.openDrawer()}/>
                    </TouchableOpacity>
                </Left>
                <Body style={{}}>
                    

                </Body>
                <Right>
                    <TouchableOpacity>
                        <Icon name='md-search' style={{color:"#FFFFFF"}}/>
                    </TouchableOpacity>
                </Right>
            </Header>
        );
    }
}
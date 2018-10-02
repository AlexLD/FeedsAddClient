import React from 'react';
import {createBottomTabNavigator} from 'react-navigation';
import {Icon} from 'native-base';
import HomeScreen from '../Home/HomeScreen';
import ProfileScreen from '../Home/ProfileScreen';

export default TabNav = createBottomTabNavigator(
    {
        'Me':{
            screen:ProfileScreen,
            navigationOptions:{
                title:'Me'
            }
        },
        'Home':{
            screen:HomeScreen,
            navigationOptions:{
                title:'Home'
            }
        }
    },
    {
        navigationOptions:({navigation})=>({
            tabBarIcon:({focused,tintColor})=>{
                const route = navigation.state.routeName;
                let iconName,color;
                switch(route){
                    case 'Me':
                        iconName='md-person';
                        break;
                    case 'Home':
                        iconName='md-home';
                        break;
                }
                if(focused) color='#34495e';
                else color='#ecf0f1';
                return <Icon name={iconName} style={{color:color}}></Icon>
            }
        }),
        tabBarOptions: {
            activeTintColor: '#000',
            labelStyle: {
                fontSize: 12,
                fontWeight: 'bold',
            },
            showIcon:true,
            style: {
                backgroundColor: 'white',
            },
        },
    }
)
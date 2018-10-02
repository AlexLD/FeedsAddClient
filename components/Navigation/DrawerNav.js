import React from 'react';
import { createDrawerNavigator } from 'react-navigation';
import DrawerContent from './DrawerContent';
import Accounts from '../ManageAccounts/Accounts';
import TabNav from './TabNav';

export default DrawerNav = createDrawerNavigator(
    {
        'Home':{
            screen: TabNav,
            navigationOptions:{
                title:'Home'
            }
        },
        'Accounts':{
            screen:Accounts,
            navigationOptions:{
                title:"Manage Accounts"
            }
        }
    },
    {
        contentComponent: DrawerContent,
    }
);
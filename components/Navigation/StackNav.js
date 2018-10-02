import {createStackNavigator} from 'react-navigation';
import DrawerNav from './DrawerNav';
import ChatSupport from '../AskQuestions/ChatSupport';
import Login from '../Login/Login';
import Signup from '../Login/Signup';

export default StackNav = createStackNavigator(
    {
        'Login':{
            screen: Login,
        },
        'Signup':{
            screen: Signup,
        },
        'DrawerNav':{
            screen: DrawerNav,
        },
        'ChatSupport':{
            screen:ChatSupport,
        }
    },
    {
        headerMode:'none',
    }
)
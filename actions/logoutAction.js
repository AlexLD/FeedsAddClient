import { LOG_OUT } from './index';
import { logout } from '../server/auth';

export const logoutAction = ()=> dispatch =>{
    logout().then(()=>{
        dispatch({
            type:LOG_OUT,
        })
    })
}
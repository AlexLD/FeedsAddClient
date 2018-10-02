const config = require('./config.json');
import { AsyncStorage } from 'react-native';

/*
resolve:{
    success: true,    
    user: {
        id,
        username,
        email,
    },
    token: jwt token
}

reject:{
    success: false,
    message
}
*/
export const login = (username, password)=>{
    const FETCH_TIMEOUT = 8000;
    let didTimeOut = false;

    return new Promise((resolve,reject)=>{
        const timeout = setTimeout(() => {
            didTimeOut=true;
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);

        const url = config.endpoint + '/Login';
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                username,
                password,
            })
        })
        .then(response=>response.json())
        .then((result)=>{
            clearTimeout(timeout);
            if(!didTimeOut){
                resolve(result);
            }
        })
        .catch((err)=>{
            console.log(err);
            if(!didTimeOut){
                reject(err);
            }
        })
    }) 
}

/*
resolve:{
    success: true
}

reject:{
    success: false,
    message
}
*/
export const registerUser = (user)=>{
    return new Promise((resolve,reject)=>{
        fetch(config.endpoint + '/Signup',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(user)
        })
        .then(response=>response.json())
        .then(result=>{
            resolve(result);
        })
        .catch(err=>{
            reject(err);
        })
    })
}

export const logout =()=>{
    return AsyncStorage.multiRemove(['jwt','user_id','oauth']);
}

/**
 * Returns an array of accounts user has oauth tokens for
 */
export const getAllOAuthTokens = ()=>{
    return new Promise((resolve,reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            if(jwt!==null){
              fetch(config.endpoint + '/OAuth/GetOAuth',{
                  method:'GET',
                  headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt,
                  }
              })
              .then(response=>response.json())
              .then(result=>{
                  resolve(result);
              })
              .catch(err=>{
                  reject(err);
              })
            }
        }).catch(err=>{
            reject(err);
        })
    })
} 
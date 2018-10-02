import {AsyncStorage} from 'react-native';
const config = require('./config.json');

/**
 * Initiate the OAuth token request
 * @param forceUpdate if set to true, ignore server side cache of the tokens because they are invalid or expired
 */
export const requestTwitterToken = (forceUpdate)=>{
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            fetch(config.endpoint + '/OAuth/RequestToken/Twitter',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt,
                },
                body:JSON.stringify({
                    ignoreCache: forceUpdate,
                    callback: config.callback
                }),
            })
            .then(response=>response.json())
            .then(result=>{
                resolve(result);
            })
            .catch(reason=>{
                reject(reason);
            })
        }).catch(reason=>{
            reject(reason);
        })
        
    });
}

/**
 * exchange the short lived token for more permanent token
 * @param short_lived_token temporary token from Facebook
 */
export const requestFacebookToken = (short_lived_token)=>{
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            fetch(config.endpoint + '/OAuth/RequestToken/Facebook',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt,
                },
                body:JSON.stringify({
                    short_lived_token: short_lived_token
                }),
            })
            .then(response=>response.json())
            .then(result=>{
                resolve(result);
            })
            .catch(reason=>{
                reject(reason);
            })
        }).catch(reason=>{
            reject(reason);
        })
        
    });
}

/**
 * Passing Token/Verifier to server to request for Access Token
 * @param query returned from Twttier/Facebook OAuth service, contains token and verifier
 */
export const twitterOAuthCallback = (query)=>{
    return new Promise((resolve,reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            fetch(config.endpoint + '/OAuth/Callback/Twitter?'+query,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt,
                },
            })
            .then(response=>response.json())
            .then(result=>{
                resolve(result);
            })
            .catch(reason=>{
                reject(reason);
            })
        }).catch(reason=>{
            reject(reason);
        });
    })
}

/**
 * handle oauth redirect from Twitter/Facebook etc.
 */
export const handleOAuthCallback = (event)=>{
    return new Promise((resolve,reject)=>{
        const url = event.url;
        let index = url.indexOf("?");
        if(index>0){
            const query = url.slice(index+1);
            //send Token and Verifier from twitter back to server
            twitterOAuthCallback(query).then(response=>{
                if(response.success){
                    resolve(); //auth granted
                }else{
                    reject(); //auth denied
                }
            })
        }else{
            reject();
        }
    })    
}

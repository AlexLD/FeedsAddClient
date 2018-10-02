import {AsyncStorage} from 'react-native';
const config = require('./config.json');

/**
 * load user timeline from server
 * @param isProfile true if loading profile timeline, false when loading home timeline
 */
export const load_timeline = (isProfile)=>{
    let endPoint = config.endpoint + '/LoadContent/All';
    let url = isProfile?`${endPoint}/User`:`${endPoint}/Home`;

    const FETCH_TIMEOUT = 5000;
    let didTimeOut = false;

    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            const timeout = setTimeout(() => {
                didTimeOut=true;
                reject(new Error('Request timed out'));
            }, FETCH_TIMEOUT);
    
            fetch(url, {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt,
                }
            })
            .then(response=>response.json())
            .then(result=>{
                clearTimeout(timeout);
                if(!didTimeOut){
                    resolve(result);
                }
            })
            .catch(reason=>{
                if(!didTimeOut){
                    reject(reason);
                }
            })
        }).catch(reason=>{
            reject(reason);
        });
        
    })
}
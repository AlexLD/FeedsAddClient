import {AsyncStorage} from 'react-native';
const config = require('./config.json');

/**
 * load user timeline from server
 * @param isProfile true if loading profile timeline, false when loading home timeline
 * @param twitter_max_id return results with an ID less than (that is, older than) or equal to the specified ID
 * @param fb_max_time return results with a timestamp older than or equal to the specified time
 */
export const load_timeline = (isProfile, twitter_max_id, fb_max_time)=>{
    let endPoint = config.endpoint + '/LoadContent/All';
    let url = isProfile?`${endPoint}/User`:`${endPoint}/Home`;
    url = `${url}?twitter_max_id=${encodeURIComponent(twitter_max_id)}&fb_max_time=${encodeURIComponent(fb_max_time)}`;

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
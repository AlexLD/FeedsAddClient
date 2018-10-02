import { GET_CACHED_FEEDS_HOME, GET_CACHED_FEEDS_ME, BEGIN_FETCH_ME, BEGIN_FETCH_HOME, FETCH_FEEDS_HOME, FETCH_FEEDS_ME, POST_FEED } from './index';
import { load_timeline } from '../server/loadContent';

/**
 * Load feeds from cached state instead of fetching from server
 */
export const getCachedFeeds = (isProfileScreen) => (dispatch, getState) =>{
    let state = isProfileScreen? getState().profileFeedReducer: getState().homeFeedReducer;
    if(state.feeds && state.feeds.length>0){
        dispatch({
            type:isProfileScreen?GET_CACHED_FEEDS_ME: GET_CACHED_FEEDS_HOME,
        })
    }else{
        dispatch(fetchFeeds(isProfileScreen));
    }
}

function beginRequest(isProfileScreen){
    return {
        type: isProfileScreen? BEGIN_FETCH_ME: BEGIN_FETCH_HOME,
    }
}

export const fetchFeeds = (isProfileScreen)=> dispatch => {
    let feeds = [];
    let payload = {};
    dispatch(beginRequest(isProfileScreen));
    load_timeline(isProfileScreen).then(result=>{
        if(!result.success){
            //requireAuth: no authorization available
            //error: 89 expired token, 215 wrong token
            if(result.requireAuth || result.authError){
                payload = {
                    showGetStarted:true,
                    feeds: feeds,
                }
            }
            dispatch({
                type: isProfileScreen?FETCH_FEEDS_ME: FETCH_FEEDS_HOME,
                payload: payload,
            })
            return;
        }
        
        let array = result.result.array;
        let addtlInfo = result.result.additionalInfo;
        
        array.forEach(obj => {
            let post = {
                id: obj.id,
                time: obj.time,
                favCount: obj.favorite_count,
                text: obj.text,
                user: obj.user,
                reply_to_user: obj.reply_to_user,
                img: obj.profileImage,
                full_picture: obj.contentImage,
            }
            feeds.push(post);
        });
        
        payload = {
            feeds: feeds,
            errMsg: "",
            showGetStarted: false,
        }
        dispatch({
            type: isProfileScreen?FETCH_FEEDS_ME: FETCH_FEEDS_HOME,
            payload: payload,
        })
    }).catch(err=>{
        if(err){
            payload.errMsg = err.message;
        }
        dispatch({
            type: isProfileScreen?FETCH_FEEDS_ME: FETCH_FEEDS_HOME,
            payload: payload,
        })
    })
}
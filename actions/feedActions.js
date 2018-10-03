import { GET_CACHED_FEEDS_HOME, GET_CACHED_FEEDS_ME, BEGIN_FETCH_ME, BEGIN_FETCH_HOME, FETCH_FEEDS_HOME, FETCH_FEEDS_ME, 
    POST_FEED, BEGIN_FETCH_MORE_HOME, BEGIN_FETCH_MORE_ME, FETCH_MORE_FEEDS_HOME, FETCH_MORE_FEEDS_ME } from './index';
import { load_timeline } from '../server/loadContent';

/**
 * Load feeds from cached state if available instead of fetching from server
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

/**
 * trigger an update on the isLoading state, so that the spinner shows
 * @param isProfileScreen determines which state (screen) to update
 */
function beginRequest(isProfileScreen){
    return {
        type: isProfileScreen? BEGIN_FETCH_ME: BEGIN_FETCH_HOME,
    }
}

/**
 * trigger an update on the isLoading state, so that the spinner shows
 * @param isProfileScreen determines which state (screen) to update
 */
function beginRequestMore(isProfileScreen){
    return {
        type: isProfileScreen? BEGIN_FETCH_MORE_ME: BEGIN_FETCH_MORE_HOME,
    }
}

/**
 * load feeds from server
 * @param isProfileScreen determines whether to load home timeline or user timeline
 */
export const fetchFeeds = (isProfileScreen)=> dispatch => {
    let feeds = [];
    let twitter_max_id = undefined;
    let fb_nextUrl = undefined;
    dispatch(beginRequest(isProfileScreen));

    let actionType = isProfileScreen?FETCH_FEEDS_ME: FETCH_FEEDS_HOME;
    fetchAction(isProfileScreen, actionType, feeds, twitter_max_id, fb_nextUrl, dispatch);
}

/**
 * load more feeds when user scrolls to the bottom of screen
 * @param isProfileScreen determines whether to load home timeline or user timeline
 */
export const fetchMore = (isProfileScreen) => (dispatch, getState) => {
    let feeds = [];
    let twitter_max_id = undefined;
    let fb_nextUrl = undefined;
        
    dispatch(beginRequestMore(isProfileScreen));

    let state = isProfileScreen? getState().profileFeedReducer: getState().homeFeedReducer;
    if(state.twitter_max_id){
        twitter_max_id = state.twitter_max_id;
    }
    if(state.fb_nextUrl){
        fb_nextUrl = state.fb_nextUrl;
    }
    if(state.feeds && state.feeds.length>0){
        feeds = state.feeds;
    }
    let actionType = isProfileScreen?FETCH_MORE_FEEDS_ME: FETCH_MORE_FEEDS_HOME;
    fetchAction(isProfileScreen, actionType, feeds, twitter_max_id, fb_nextUrl, dispatch);
}

/**
 * Modularize the fetch action to be reused by both fetchFeeds and fetchMore
 * @param isProfileScreen determines which timeline to load
 * @param actionType determines the action to be dispatched
 * @param feeds prepopulated with existing feeds if the action is fetchMore
 * @param twitter_max_id last twitter id fetched
 * @param fb_nextUrl next facebook url to call
 * @param dispatch dispatcher
 */
function fetchAction(isProfileScreen, actionType, feeds, twitter_max_id, fb_nextUrl, dispatch) {
    let payload = {};
    load_timeline(isProfileScreen, twitter_max_id, fb_nextUrl).then(result=>{
        if(!result.success){
            //requireAuth: no authorization available
            //error: 89 expired token, 215 wrong token, 190 facebook token expired
            if(result.requireAuth || result.authError){
                payload = {
                    showGetStarted:true,
                    feeds: feeds,
                    twitter_max_id: twitter_max_id,
                    fb_nextUrl: fb_nextUrl,
                }
            }
            
            dispatch({
                type: actionType,
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

        addtlInfo.forEach(info=>{
            if(info.max_id){
                twitter_max_id = info.max_id;
            }else if(info.nextUrl){
                fb_nextUrl = info.nextUrl;
            }
        })
        
        payload = {
            feeds: feeds,
            errMsg: "",
            showGetStarted: false,
            twitter_max_id: twitter_max_id,
            fb_nextUrl: fb_nextUrl,
        }
        dispatch({
            type: actionType,
            payload: payload,
        })
    }).catch(err=>{
        if(err){
            payload.errMsg = err.message;
        }
        dispatch({
            type: actionType,
            payload: payload,
        })
    })
}
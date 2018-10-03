import { GET_CACHED_FEEDS_HOME, GET_CACHED_FEEDS_ME, BEGIN_FETCH_ME, BEGIN_FETCH_HOME, FETCH_FEEDS_HOME, 
    FETCH_FEEDS_ME, POST_FEED, BEGIN_FETCH_MORE_ME, BEGIN_FETCH_MORE_HOME, FETCH_MORE_FEEDS_ME, FETCH_MORE_FEEDS_HOME} from '../actions';
import { ListView } from 'react-native';

const ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});

const initialState = {
    feeds: [],
    isLoading: false,
    dataSource:ds.cloneWithRows([]),
    errMsg:"",
    showGetStarted:false,
    twitter_max_id: '',
    fb_max_time: '',
    isLoadingMore: false,
}

/**
 * Reducer for the profile feed screen
 */
export const profileFeedReducer = (state=initialState, action) => {
    switch(action.type){
        case GET_CACHED_FEEDS_ME:
            return state;
        case BEGIN_FETCH_ME:
            return {
                ...state,
                isLoading:true,
            }
        case FETCH_FEEDS_ME:
            return {
                ...state,
                feeds: action.payload.feeds,
                isLoading: false,
                showGetStarted: action.payload.showGetStarted,
                errMsg: action.payload.errMsg,
                dataSource: ds.cloneWithRows(action.payload.feeds?action.payload.feeds:[]),
                twitter_max_id: action.payload.twitter_max_id,
                fb_max_time: action.payload.fb_max_time,
            }
        case BEGIN_FETCH_MORE_ME:
            return {
                ...state,
                isLoadingMore:true,
            }
        case FETCH_MORE_FEEDS_ME:
            return {
                ...state,
                feeds: action.payload.feeds,
                isLoadingMore: false,
                showGetStarted: action.payload.showGetStarted,
                errMsg: action.payload.errMsg,
                dataSource: ds.cloneWithRows(action.payload.feeds?action.payload.feeds:[]),
                twitter_max_id: action.payload.twitter_max_id,
                fb_max_time: action.payload.fb_max_time,
            }
        case POST_FEED:
            return state;
        default:
            return state;
    }
}

/**
 * Reducer for the home feed screen
 */
export const homeFeedReducer = (state=initialState, action) => {
    switch(action.type){
        case GET_CACHED_FEEDS_HOME:
            return state;
        case BEGIN_FETCH_HOME:
            return {
                ...state,
                isLoading:true,
            }
        case FETCH_FEEDS_HOME:
            return {
                ...state,
                feeds: action.payload.feeds,
                isLoading: false,
                showGetStarted: action.payload.showGetStarted,
                errMsg: action.payload.errMsg,
                dataSource: ds.cloneWithRows(action.payload.feeds?action.payload.feeds:[]),
                twitter_max_id: action.payload.twitter_max_id,
                fb_max_time: action.payload.fb_max_time,
            }
        case BEGIN_FETCH_MORE_HOME:
            return {
                ...state,
                isLoadingMore:true,
            }
        case FETCH_MORE_FEEDS_HOME:
            return {
                ...state,
                feeds: action.payload.feeds,
                isLoadingMore: false,
                showGetStarted: action.payload.showGetStarted,
                errMsg: action.payload.errMsg,
                dataSource: ds.cloneWithRows(action.payload.feeds?action.payload.feeds:[]),
                twitter_max_id: action.payload.twitter_max_id,
                fb_max_time: action.payload.fb_max_time,
            }
        case POST_FEED:
            return state;
        default:
            return state;
    }
}
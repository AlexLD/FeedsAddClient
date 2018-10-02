import { combineReducers } from 'redux';
import { homeFeedReducer, profileFeedReducer } from './feedReducer';
import { LOG_OUT } from '../actions';

const appReducer = combineReducers({
    homeFeedReducer,
    profileFeedReducer,
});

export default rootReducer = (state, action)=>{
    if(action.type === LOG_OUT){
        state = undefined;
    }
    return appReducer(state, action);
}
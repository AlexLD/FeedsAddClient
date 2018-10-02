import React from 'react';
import FeedScreen from './FeedScreen';

export default class ProfileScreen extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <FeedScreen
                isProfileScreen={true}
                navigation={this.props.navigation}
            />
        );
    }
}
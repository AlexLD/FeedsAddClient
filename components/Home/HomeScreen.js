import React from 'react';
import FeedScreen from './FeedScreen';

export default class HomeScreen extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <FeedScreen
                isProfileScreen={false}
                navigation={this.props.navigation}
            />
        );
    }
}
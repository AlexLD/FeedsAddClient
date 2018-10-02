import React from 'react';
import { View, ListView, Text, RefreshControl, ActivityIndicator, AsyncStorage } from 'react-native';
import { CardItem, Card, Container, Icon, Fab } from 'native-base';
import { connect } from 'react-redux';
import AppHeader from './AppHeader';
import FeedCard from './FeedCard';
import GetStarted from './GetStarted';
import Theme from '../../styles/theme';
import { fetchFeeds, getCachedFeeds } from '../../actions/feedActions';

class FeedScreen extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});
        this.state = {
            contactUs:false,
            isLoadingMore:false,
            user:"",
        };
        this.timer = undefined;
    }
    componentWillMount(){
        AsyncStorage.getItem('user_id').then((value)=>{
            this.setState({user:value});
        })
    }
    componentDidMount(){
        this.props.getCachedFeeds();
    }
    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    fetchData = ()=>{
        this.props.fetchFeeds();
    }

    onRefresh = ()=>{
        this.fetchData();
    }

    onLoadMore = ()=>{
        if(this.props.errMsg || this.props.showGetStarted) return;
        this.setState({isLoadingMore:true});
        this.timer = setTimeout(() => {
            this.setState({isLoadingMore:false});
        }, 3000);
    }

    renderRow = (feed)=>{
        return (
            <FeedCard
                feed={feed}
            ></FeedCard>
        )
    }

    render(){
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}/>
                <View style={{flex:1}}>
                    <Card style={{display:this.props.errMsg?'flex':'none'}}>
                        <CardItem>
                            <Text>{this.props.errMsg}</Text>
                        </CardItem>
                    </Card>
                    {this.props.showGetStarted?
                        <GetStarted navigation={this.props.navigation}/>
                        :null
                    }
                    <ListView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.isLoading}
                                onRefresh={this.onRefresh}
                            />
                        }
                        dataSource={this.props.dataSource}
                        renderRow={this.renderRow}
                        enableEmptySections={true}
                        renderFooter={()=>(
                            this.state.isLoadingMore &&
                            <View>
                                <ActivityIndicator size="small"/>
                            </View>
                        )}
                        onEndReached={this.onLoadMore}
                        onEndReachedThreshold={10}
                    />
                </View>
                <Fab
                    active={this.state.contactUs}
                    direction="up"
                    containerStyle={{}}
                    position="bottomRight"
                    onPress={()=>this.setState({contactUs:!this.state.contactUs})}
                    style={{backgroundColor: Theme.THEME_COLOR}}
                    >
                    <Icon name="md-chatbubbles" onPress={()=>alert("Not implemented yet")} />
                    
                </Fab>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) =>({
    feeds: ownProps.isProfileScreen? state.profileFeedReducer.feeds: state.homeFeedReducer.feeds,
    isLoading: ownProps.isProfileScreen? state.profileFeedReducer.isLoading: state.homeFeedReducer.isLoading,
    showGetStarted: ownProps.isProfileScreen? state.profileFeedReducer.showGetStarted: state.homeFeedReducer.showGetStarted,
    errMsg: ownProps.isProfileScreen? state.profileFeedReducer.errMsg: state.homeFeedReducer.errMsg,
    dataSource: ownProps.isProfileScreen? state.profileFeedReducer.dataSource: state.homeFeedReducer.dataSource,
});

const mapDispatchToProps = (dispatch, ownProps)=>({
    fetchFeeds: ()=> dispatch(fetchFeeds(ownProps.isProfileScreen)),
    getCachedFeeds: () => dispatch(getCachedFeeds(ownProps.isProfileScreen)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen);
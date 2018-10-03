import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, AsyncStorage, RefreshControl } from 'react-native';
import { Container, Card, CardItem, Left, Icon, Body, Right, Button} from 'native-base';
import AppHeader from '../Home/AppHeader';
import { getAllOAuthTokens } from '../../server/auth';
import { requestTwitterToken, requestFacebookToken, handleOAuthCallback } from '../../server/requestToken';
import { WebBrowser, Linking, Facebook } from 'expo';
import Theme from '../../styles/theme';
import config from '../../server/config.json';

export default class Accounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            twitter:false,
            twitterValid:false,
            facebook:false,
            facebookValid:false,
            refreshing: false,
        };
    }

    /**
     * load oauth tokens so that the buttons can be properly generated
     */
    componentWillMount(){
        AsyncStorage.getItem("oauth").then(value=>{
            if(value!==null){
                this.setOAuthStates(JSON.parse(value));
            }else{
                this.onRefresh();
            }
        })
    }
    /**
     * listen to callback from Twitter during OAuth token request process
     */
    componentDidMount(){
        Linking.addEventListener('url',this.urlHandler);
    }
    componentWillUnmount(){
        Linking.removeEventListener('url',this.urlHandler);
    }
    /**
     * open a browser for the Twitter page
     */
    urlHandler = (event)=>{
        WebBrowser.dismissBrowser();
        handleOAuthCallback(event).then(()=>{
            this.onRefresh();
        }).catch(()=>{
            console.log("auth denied by end user");
        })
    }

    setOAuthStates(oauth){
        oauth.forEach(elem => {
            switch(elem.account){
                case 1:
                this.setState({twitter:true, twitterValid:elem.valid});
                break;
                case 2:
                this.setState({facebook:true, facebookValid:elem.valid});
                break;
            }
        });
    }

    /**
     * handle Add Account button clicks
     */
    addAccount = (account, forceRequest)=>{
        if(account == 1){
            requestTwitterToken(forceRequest).then(result=>{
                if(result && !result.ready){
                    WebBrowser.openAuthSessionAsync(result.redirect);
                }
            }).catch(err=>{
                console.log(err);
            })
        }else if(account==2){
            this.facebookLogin();
        }
        
    }

    /**
     * Use Expo's Facebook module for for token request
     */
    facebookLogin = ()=>{
        Facebook.logInWithReadPermissionsAsync(config.FB_APP_ID,{
            permissions:['email','user_posts','user_photos'],
        }).then((response)=>{
            if(response.type == 'success'){
                requestFacebookToken(response.token).then(result=>{
                    if(result.ready){
                        this.onRefresh();
                    }
                });
            }else{  // 'cancel'
                console.log("auth denied by end user (facebook)");
            }
        })
        
    }

    removeAccount = (account)=>{
        alert(`Not implemented yet. Remove authorization from your ${account==1?'Twitter':'Facebook'} account`);
    }

    /**
     * reloads oauth statues from server in case things have changed
     */
    onRefresh = ()=>{
        this.setState({refreshing:true});
        getAllOAuthTokens().then(result=>{
            if(result.oauth){
                this.setOAuthStates(result.oauth);
                AsyncStorage.setItem("oauth",JSON.stringify(result.oauth));
            }
            this.setState({refreshing:false});
        }).catch(err=>{
            console.log(err);
            this.setState({refreshing:false});
        })
    }

    /**
     * render the Add/Remove buttons for twitter facebook account
     * @param logo Twitter log or Facebook logo
     * @param color color of the logo
     * @param text text to display next to logo
     * @param tokenExist do we have a token for the account?
     * @param tokenValid if yes, is it still valid?
     * @param accountNo 1 for twitter, 2 for facebook
     */
    renderAccount(logo, color, text, tokenExist, tokenValid, accountNo){
        return(
            <CardItem>
                <Left>
                    <Icon active name={logo} style={{ color: color }} />
                    <Text style={styles.text}>{text}</Text>
                </Left>
                <Body style={{justifyContent: 'center', alignItems:'flex-end'}}>
                    {tokenExist && !tokenValid?
                        <Text style={{color:'#c0392b'}}>token expired</Text>
                    :null}
                </Body>
                <Right>
                    {tokenExist && tokenValid?
                        <Button onPress={()=>this.removeAccount(accountNo)} style={styles.removeButton}><Text style={styles.text}>Remove</Text></Button>:
                        <Button onPress={()=>this.addAccount(accountNo, tokenExist && !tokenValid)} style={styles.addButton}><Text style={styles.text}>Add</Text></Button>}
                </Right>
            </CardItem>
        )
    }

    render() {
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}/>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                >
                    <Card>
                        <CardItem header bordered>
                            <Text style={styles.text}>Manage Accounts</Text>
                        </CardItem>
                        {this.renderAccount("logo-twitter","#55ACEE", "twitter", this.state.twitter, this.state.twitterValid, 1)}
                        {this.renderAccount("logo-facebook","#3B579D", "facebook", this.state.facebook, this.state.facebookValid, 2)}
                    </Card>
                </ScrollView>
            </Container>
        
        );
    }
}

const styles = StyleSheet.create({
    addButton:{
        width:70, 
        height:40, 
        justifyContent:'center',
        backgroundColor: Theme.ADD_COLOR,
    },
    removeButton:{
        width:70, 
        height:40, 
        justifyContent:'center',
        backgroundColor: Theme.REMOVE_COLOR,
    },
    text:{
        color:'#2d3436',
        marginLeft: 5,
    }
})
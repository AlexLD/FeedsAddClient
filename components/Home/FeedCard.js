import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, CardItem, Left, Body} from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default class FeedCard extends Component {
    constructor(props) {
        super(props);
            this.state = {
        };
    }

    render() {
        return (
            <Card>
                <CardItem style={styles.row}>
                    <Left style={styles.profileContainer}>
                        <Image source={{uri:this.props.feed.img}} style={styles.profile} />
                    </Left>
                    <Body style={{flex:4}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.name}>{this.props.feed.user.name}</Text>
                            <Text style={styles.date}>{this.props.feed.time}</Text>
                        </View>
                        {this.props.feed.reply_to_user && this.props.feed.reply_to_user.name? <Text style={styles.feedText}>Replying to {this.props.feed.reply_to_user.name}</Text>:null}
                        <Text style={styles.feedText}>{this.props.feed.text}</Text>
                        <Image source={{uri:this.props.feed.full_picture}} style={{marginTop:10, height:300, width:300, borderRadius: 5}}/>
                    </Body>
                </CardItem>
                
                <CardItem style={styles.actionIconRow}>
                    <View style={styles.actionIconContainer}>
                        <EvilIcons style={styles.actionIcon} name="comment" size={30}></EvilIcons>
                    </View>
                    <View style={styles.actionIconContainer}>
                        <EvilIcons style={styles.actionIcon} name="retweet" size={30}></EvilIcons>
                    </View>
                    <View style={styles.actionIconContainer}>
                        <EvilIcons style={styles.actionIcon} name="heart" size={30}></EvilIcons>
                    </View>
                </CardItem>
            </Card>
        )
    }
}

const styles = StyleSheet.create({
    name:{
        fontSize:16, 
        fontWeight:"bold", 
        color:"#0e2f44"
    },
    date:{
        marginLeft:5, 
        fontSize:16, 
        color:"#666666"
    },
    profileContainer:{
        flex:1, 
        alignSelf:'flex-start'
    },
    profile:{
        width:60, 
        height:60, 
        borderRadius:100
    },
    row:{
        flexDirection:'row',
    },
    feedText:{
        minHeight: 30,
        fontSize:16, 
        color:"#666666",
    },
    actionIconRow:{
        flexDirection:'row'
    },
    actionIconContainer:{
        flex:1
    },
    actionIcon:{
        alignSelf:'center'
    }
})
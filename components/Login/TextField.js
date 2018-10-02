import React from 'react';
import { View, TextInput, Text, StyleSheet} from 'react-native';

export default class TextField extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <View>
                <TextInput
                    placeholderTextColor="#FFF"
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    ref={input=>this.textInput=input}
                    {...this.props}/>
                {this.props.error? <Text style={styles.error}>{this.props.error}</Text> : null}
            </View>
        )
    }
}
    

const styles = StyleSheet.create({
    input:{
        height:40,
        backgroundColor:'rgba(255,255,255,0.2)',
        color:'#FFF',
        marginBottom: 10,
        paddingHorizontal: 10,
        borderWidth: 0
    },
    error:{
        marginTop: -10,
        color:'#d35400',
        marginBottom:10,
    }
})
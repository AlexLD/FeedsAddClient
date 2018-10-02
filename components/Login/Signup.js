import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, TouchableOpacity, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { Icon } from 'native-base';
import TextField from './TextField';
import { registerUser } from '../../server/auth';

const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userName:"",
        email:"",
        password:"",
        confirmPW:"",
        userNameError:"",
        lastNameError:"",
        emailError:"",
        passwordError:"",
        confirmPWError:"",
        isSigningup:false
    };
  }

  trySignup = ()=>{
        if(!this.validateFields()) return;

        this.setState({isSigningup:true});
        const user = {
            userName: this.state.userName,
            email: this.state.email,
            password: this.state.password,
        }
        registerUser(user).then(result=>{
            if(result.success){
                Alert.alert(
                    'Success',
                    'You\'ve successfully created a new account.',
                    [
                        {text:'Go to login', onPress:()=>{this.props.navigation.navigate('Login')}},
                        {text:'Done', style:'cancel'}
                    ]
                )
            }else{
                Alert.alert(
                    'Failed',
                    result.message,
                    [
                        {text:'Ok', style:'cancel'}
                    ]
                )
            }
            this.setState({isSigningup:false});
        }).catch(err=>{
            this.setState({isSigningup:false});
            Alert.alert(
                'Error',
                err.message,
                [
                    {text:'Ok', style:'cancel'}
                ]
            )
        });
      
  }

  validateFields = ()=>{
    let isValid = true;
    if(!this.state.userName){
        this.setState({userNameError:"Enter user name"});
        isValid = false;
    }else{
        this.setState({userNameError:""});
    }
    if(!email_regex.test(this.state.email)){
        this.setState({emailError:"Incorrect email format"});
        isValid = false;
    }else{
        this.setState({emailError:""});
    }
    if(this.state.password.length < 5){
        this.setState({passwordError:"Enter password longer than 5 characters"});
        isValid = false;
    }else{
        this.setState({passwordError:""});
    }
    if(this.state.confirmPW!==this.state.password){
        this.setState({confirmPWError:"Does not match password"});
        isValid = false;
    }else{
        this.setState({confirmPWError:""});
    }
    return isValid;
  }

  render() {
    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <TouchableOpacity style={{paddingTop: StatusBar.currentHeight, paddingLeft:10}}  onPress={()=>this.props.navigation.navigate('Login')}>
                <Icon name='md-arrow-back' style={{color:"#FFFFFF"}}/>
            </TouchableOpacity>
            
            <View style={{flex:1, flexDirection: 'column'}}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../resources/icons/app.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>An app for all your social media feeds</Text>
                    {this.state.isSigningup?(<ActivityIndicator color="#FFF" size="large"></ActivityIndicator>):null}
                </View>
            
                <View style={styles.form}>
                    <TextField
                        placeholder="User Name"
                        returnKeyType="next"
                        ref={field=>this.userNameInput = field}
                        onSubmitEditing={()=>this.emailInput.textInput.focus()}
                        autoCapitalize="sentences"
                        onChangeText={userName=>this.setState({userName})}
                        error={this.state.userNameError}
                    />
                    <TextField
                        placeholder="Email"
                        returnKeyType="next"
                        ref={field=>this.emailInput = field}
                        onSubmitEditing={()=>this.passwordInput.textInput.focus()}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={email=>this.setState({email})}
                        error={this.state.emailError}
                    />
                    <TextField
                        placeholder="Password"
                        secureTextEntry={true}
                        returnKeyType="go"
                        ref={field=>this.passwordInput = field}
                        onSubmitEditing={()=>this.confirmPWInput.textInput.focus()}
                        onChangeText={password=>this.setState({password:password.trim()})}
                        error={this.state.passwordError}
                    />
                    <TextField
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        returnKeyType="go"
                        ref={field=>this.confirmPWInput = field}
                        onSubmitEditing={()=>this.signupButton.props.onPress()}
                        onChangeText={confirmPW=>this.setState({confirmPW})}
                        error={this.state.confirmPWError}
                    />
                    <TouchableOpacity 
                        style={styles.buttonContainer} 
                        ref={button=>this.signupButton = button}
                        onPress={this.trySignup}
                        >
                        <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#34495e',
    },
    logoContainer:{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent:'center',
        flex:1
    },
    logo:{
        height:60,
        width:60,
    },
    title:{
        color:'#FFF',
        marginTop: 10,
    },
    form:{
        flex:5,
        padding:20,
        marginBottom: 20,
        marginTop:0,
    },
    buttonContainer:{
        backgroundColor:'#2c3e50',
        paddingVertical: 15,
    },
    buttonText:{
        textAlign:'center',
        color:'#FFF',
        fontWeight: '700',
    }
})

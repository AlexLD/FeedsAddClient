import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, AsyncStorage, Alert } from 'react-native';
import { login } from '../../server/auth';
import TextField from './TextField';
import Theme from '../../styles/theme';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        username:"",
        password:"",
        usernameError:"",
        passwordError:"",
        isLoggingin:false,
    };
  }

  /**
   * user automatically logged in if didn't log out previously
   */
  componentWillMount(){
    AsyncStorage.getItem('jwt').then(value=>{
      if(value!==null){
        this.props.navigation.navigate('Accounts');
      }
    });
  }

  tryLogin = ()=>{
    if(!this.validateFields()) return;

    this.setState({isLoggingin:true});
    login(this.state.username,this.state.password).then((result)=>{
        if(result.success){
            const user = result.user;
            const jwt = result.token;
            const hasOAuth = result.hasOAuth;
            AsyncStorage.multiSet([['jwt',jwt],['user_id',user.id]]).then(()=>{
                let nextScreen = 'DrawerNav';
                this.props.navigation.navigate(nextScreen);
            });
        }else{
            Alert.alert(
                result.message,
                'Sorry, your entered information is incorrect. Please try again or create a new account.',
                [
                    {text:'Create A New Account', onPress:()=>{this.props.navigation.navigate('Signup')}},
                    {text:'Try Again', style:'cancel'}
                ]
            )
        }
        this.setState({isLoggingin:false});
    }).catch(err=>{
        this.setState({isLoggingin:false});
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
    if(!this.state.username){
        this.setState({usernameError:"Enter user name or email"});
        isValid = false;
    }else{
        this.setState({usernameError:""});
    }
    if(!this.state.password.length){
        this.setState({passwordError:"Enter password"});
        isValid = false;
    }else{
        this.setState({passwordError:""});
    }
    return isValid;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image
                source={require('../../resources/icons/app.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>An app for all your social media feeds</Text>
            {this.state.isLoggingin?(<ActivityIndicator color="#FFF" size="large"></ActivityIndicator>):null}
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <TextField
                placeholder="Username or Email"
                returnKeyType="next"
                ref={field=>this.usernameInput = field}
                onSubmitEditing={()=>this.passwordInput.textInput.focus()}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={username=>this.setState({username})}
                error={this.state.usernameError}
            />
            <TextField
                placeholder="Password"
                secureTextEntry={true}
                returnKeyType="go"
                ref={field=>this.passwordInput = field}
                onSubmitEditing={()=>this.loginButton.props.onPress()}
                onChangeText={password=>this.setState({password})}
                error={this.state.passwordError}
            />
            <TouchableOpacity 
                style={styles.buttonContainer} 
                ref={button=>this.loginButton = button}
                onPress={this.tryLogin}
                >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.buttonContainer} 
                ref={button=>this.signupButton = button}
                onPress={()=>this.props.navigation.navigate('Signup')}
                >
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: Theme.THEME_COLOR,
    },
    logoContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent:'center'
    },
    logo:{
        height:100,
        width:100,
    },
    title:{
        color:'#FFF',
        marginTop: 10,
    },
    form:{
        padding:20,
        marginBottom: 20,
    },
    buttonContainer:{
        backgroundColor: Theme.DARK_COLOR,
        paddingVertical: 15,
        marginBottom:10,
    },
    buttonText:{
        textAlign:'center',
        color:'#FFF',
        fontWeight: '700',
    }
})

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Alert, Image, Dimensions } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Spinner from 'react-native-loading-spinner-overlay'
import { AuthContext } from '../context/AuthContext'

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SignInScreen = ({ navigation }) => {
  const { login, isLoading } = useContext(AuthContext)
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <Spinner visible={isLoading} />
        <View>
          <View style={styles.content}>
            <Image
              source={require('../images/logo.png')}
              style={{ height: 100, width: 100 }}
            />
            <Text style={{ fontSize: 34, fontWeight: 800, color: 'black' }}>
              Log in to Twitter
            </Text>
          </View>
          <View style={styles.signIn}>
            <View style={styles.inputView}>
              <TextInput
                placeholder="Email"
                value={email}
                style={styles.input}
                onChangeText={text => setEmail(text)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                keyboardType='numeric'
                placeholder="Password"
                value={password}
                style={styles.input}
                onChangeText={text => setPassword(text)}
                secureTextEntry />
            </View>
            <TouchableOpacity onPress={async() => {
              if (email === null || password === null) {
                Alert.alert('Login Failed', 'Please enter the login credentials')
              } else {
                try {
                  await login(email, password);
                } catch (error) {
                  Alert.alert('Login Failed', error.message);
                }
              }
            }
            }>
              <Text style={styles.loginButton}>Log In</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginHorizontal: screenWidth - 405, width: '100%' }}>
                <Text style={styles.link}>Sign up for Twitter </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    height: 60,
    width: '100%',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    borderColor: '#00C2FF'
  },
  inputView: {
    height: 80,
  },
  signIn: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '100%',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  background: {
    flex: 1,
    marginVertical: screenHeight - 750,
    marginHorizontal: screenWidth - 405
  },
  content: {
    padding: 20,
  },
  link: {
    color: '#00C2FF',
    textAlign: 'center'
  },
  loginButton: {
    backgroundColor: '#00C2FF',
    padding: 10,
    borderRadius: 30,
    textAlign: 'center',
    fontSize: 20,
    color: 'white'
  }
});

export default SignInScreen
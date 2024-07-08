import { View, Text, TextInput, StyleSheet, Dimensions, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading } = useContext(AuthContext)
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
       
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.background}>
        <Spinner visible={isLoading} />
        <View style={styles.content}>
          <Image
            source={require('../images/logo.png')}
            style={{ height: 100, width: 100 }}
          />
          <Text style={{ fontSize: 34, fontWeight: 800, color: 'black' }}>
            Create Account
          </Text>
        </View>
        <View style={styles.inputView}>
          <TextInput
            placeholder='First Name'
            value={firstName}
            style={styles.input}
            onChangeText={text => setFirstName(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            placeholder='Last Name'
            value={lastName}
            style={styles.input}
            onChangeText={text => setLastName(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            placeholder='Email'
            value={email}
            style={styles.input}
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            keyboardType='numeric'
            placeholder='Phone Number'
            value={phoneNumber}
            style={styles.input}
            onChangeText={text => setPhoneNumber(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            keyboardType='numeric'
            placeholder='Password'
            value={password}
            style={styles.input}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <TouchableOpacity onPress={() => {
          if (email === null || password === null) {
            Alert.alert('Sign up Failed', 'Please enter the all credentials')
          } else {
            register(firstName, lastName, email, phoneNumber, password)
          }
        }
        }>
        <Text style={styles.signUpButton}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginTop: 20}}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginHorizontal: screenWidth - 405, width: '100%' }}>
            <Text style={styles.link}>Log in for Twitter</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    
  },
  background: {
    flex: 1,
    marginVertical: screenHeight - 750,
    marginHorizontal: screenWidth - 380
  },
  input: {
    height: 60,
    width: screenWidth - 30,
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    borderColor: '#00C2FF'
  },
  inputView: {
    height: 70,
  },
  content: {
    padding: 20,
  },
  signUpButton: {
    backgroundColor: '#00C2FF',
    padding: 10,
    borderRadius: 30,
    textAlign: 'center',
    fontSize: 20,
    color: 'white'
  },
  link: {
    color: '#00C2FF',
    textAlign:'center'
  },
})

export default RegisterScreen
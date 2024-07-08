import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { baseUrl } from '@env'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [loginState, setLoginState] = useState(false)

  const register = async (firstName, lastName, email, phoneNumber, password) => {
    setIsLoading(true);
    await axios
      .post(`http://13.234.35.178/auth/signup`, {
        firstName,
        lastName,
        phoneNumber,
        email,
        password
      })
      .then(res => {
        let userInfo = res.data;
        setLoginState(true)
        setIsLoading(false);
        console.log(userInfo);
      })
      .catch(e => {
        console.log(`register error ${e}`);
        setIsLoading(false);
      });
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`http://13.234.35.178/auth/signin`, { email, password });
      let userInfo = res.data;
      if (userInfo.STATUS === 'OK') {
        await AsyncStorage.setItem('token', JSON.stringify(userInfo.data));
        setUserInfo(userInfo.data);
        setUserId(userInfo.data.userID);
        setEmail(userInfo.data.email);
        setFirstName(userInfo.data.firstName);
        setLastName(userInfo.data.lastName);
        setLoginState(true);
      } else {
        throw new Error(userInfo.data || 'Login failed. Please try again.');
      }
    } catch (error) {
      throw new Error( 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const logout = async () => {
    setIsLoading(true);
    try {
      setLoginState(false)
      setUserInfo({});
      await AsyncStorage.removeItem('token');
      setUserInfo({});
      console.log("line number 75", userInfo);
      setIsLoading(false);
    }
    catch (e) {
      console.log(`logout error ${e}`);
      setIsLoading(false);
    };
  };

  const isLoggedIn = async () => {
    console.log('logged in function entered', userInfo);
    try {
      setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem('token');
      console.log('token:  ', userInfo);

      if (userInfo !== null && loginState === true) {
        console.log('in logged in function userInfo is present');
        userInfo = JSON.parse(userInfo);
        setUserInfo(userInfo);
        setUserId(userInfo.userID)
        setEmail(userInfo.email)
        setFirstName(userInfo.firstName)
        setLastName(userInfo.lastName)
        setLoginState(true)
      }
      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, [loginState]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        loginState,
        userId,
        email,
        firstName,
        lastName,
        register,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
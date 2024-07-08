import { Image, Text, View } from 'react-native'
import React, { useContext, useLayoutEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '../screens/SplashScreen'
import HomeScreen from '../screens/HomeScreen'
import SignInScreen from '../screens/SignInScreen'
import RegisterScreen from '../screens/RegisterScreen'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import SearchScreen from '../screens/SearchScreen'
import NotificationScreen from '../screens/NotificationScreen'
import InboxScreen from '../screens/InboxScreen'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MentionsScreen from '../screens/MentionsScreen'
import AddPostScreen from '../screens/AddPostScreen'
import SettingsScreen from '../screens/SettingsScreen'
import CommentsScreen from '../screens/CommentsScreen'

const Stack = createNativeStackNavigator()
const Tab = createMaterialTopTabNavigator()
const BottomTabs = createBottomTabNavigator()

const BottomTabNavigator = () => {
  return (
    <BottomTabs.Navigator
      tabBarOptions={{
        labelStyle: {
          fontSize: 16,
          textAlignVertical: 'center',
        },
        style: {
          flexDirection: 'row',
          alignItems:'center',
          justifyContent: 'center',
          height: 60, 
        },
      }}
    >
      <BottomTabs.Screen
        name='All'
        component={HomeScreen}
        options={{
          headerShown:false,
          tabBarLabel: 'ALL',
          tabBarIcon: ({ color, size }) => null
        }}
      />
      <BottomTabs.Screen
        name='Mentions'
        component={MentionsScreen}
        options={{
          headerShown:false,
          tabBarLabel: 'MENTIONS',
          tabBarIcon: ({ color, size }) =>null
        }}
      />
      <BottomTabs.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          headerShown:false,
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={24} />
          ), 
        }}
      />
    </BottomTabs.Navigator>
  );
};


const TabNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home'
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../images/profile_pic_default.jpg')} // Replace with your profile picture URL
            style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
          />
          <Text style={{ color: 'black', fontWeight: 600, fontSize: 18 }}>{routeName}</Text>
        </View>
      ),
    })
  }, [navigation, route])
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color='#00C2FF' size={24} />
            )
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="search" color='#00C2FF' size={24} />
            )
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="notifications" color='#00C2FF' size={24} />
            )
          }}
        />
        <Tab.Screen
          name="Inbox"
          component={InboxScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="mail" color='#00C2FF' size={24} />
            )
          }}
        />
      </Tab.Navigator>
    </>
  )
}

const Navigation = () => {
  const { userInfo, splashLoading, loginState } = useContext(AuthContext)
  return (
    <NavigationContainer fallback={<Text>Loading...</Text>}>
      <Stack.Navigator>
        {
          splashLoading ? (
            <Stack.Screen
              name="Splash Screen"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
          )
            :
            loginState === true ? (
              <>
                <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: true }} />
                <Stack.Screen name="Add Post" component={AddPostScreen} options={{headerShown: true}} />
                <Stack.Screen name="Comments" component={CommentsScreen} options={{headerShown: true}} initialParams={{ postId:'' }} />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  component={SignInScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
              </>
            )

        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
// import * as React from 'react';
import React, {useEffect} from 'react';
import {Text, Image} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-community/async-storage';


import MarketScreen from './screens/MarketScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostScreen from './screens/PostScreen';
import HouseDetailsScreen from './screens/HouseDetailsScreen';
import HouseCollectionScreen from './screens/HouseCollectionScreen';
import LoginScreen from './screens/LoginScreen';
import {FIRE_APP_INITIAL} from './firebase/firebase-auth';
import UpdateProfileScreen from '@screens/UpdateProfileScreen';
import HouseSearchResult from '@screens/HouseSearchResult';
import {RootSiblingParent} from 'react-native-root-siblings';
import {createStackNavigator} from '@react-navigation/stack';
// import WelcomeScreen from '@screens/WelcomeScreen';


const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();
const PostStack = createStackNavigator();

const HomeStack = createStackNavigator();
const LoginStack = createStackNavigator();
const RootStack = createStackNavigator();


export default function App() {
  const [initialLoad, setInitialLoad] = React.useState(false);
  /**
   * @description: This function is used to set the initial load to true, and determines if the user has already seen the onboarding screens.
   * @param {void}
   * @return {void}
   */
  useEffect(() => {
    const launchedBefore = AsyncStorage.getItem('launchedBefore');
    if (launchedBefore) {
      // do nothing
      console.log('launched before');
    } else if (launchedBefore === null) {
      AsyncStorage.setItem('launchedBefore', 'true').then((r) => setInitialLoad(true));
    }
  }, []);
  FIRE_APP_INITIAL();
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName={initialLoad ? 'Login' : 'Login'}
          screenOptions={{
            headerShown: false,
          }}
        >
          <RootStack.Screen name='Login' component={LoginRoute} />
          <RootStack.Screen name='App' component={AppTab} />
          <RootStack.Screen name='Welcome' component={WelcomeScreen} />
        </RootStack.Navigator>

      </NavigationContainer>
    </RootSiblingParent>
  );
}


const LoginRoute = () => {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen name="Login_Screen" component={LoginScreen} />
    </LoginStack.Navigator>
  );
};


const AppTab = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Market Place"
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}>
        {() => (
          <HomeStack.Navigator>
            <HomeStack.Screen name="Home" component={MarketScreen} />
            <HomeStack.Screen name="HouseDetails" component={HouseDetailsScreen} />
            <HomeStack.Screen name="Property List" component={HouseCollectionScreen} />
            <HomeStack.Screen name='home_house_search' component={HouseSearchResult} />

          </HomeStack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Post"
        options={{
          // headerShown:false,
          tabBarIcon: ({color, size}) => (
            <Icon name="plus" color={color} size={size} />
          ),
        }}>
        {() => (
          <PostStack.Navigator>
            <PostStack.Screen name="My Post" component={PostScreen} />
            <PostStack.Screen name="HouseDetails" component={HouseDetailsScreen} />
            <PostStack.Screen name="Property List " component={HouseCollectionScreen} />
          </PostStack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile"
        options={{
          // headerShown:false,
          tabBarIcon: ({color, size}) => (
            <Icon name="user-o" color={color} size={size} />
          ),
        }}>
        {() => (
          <SettingsStack.Navigator>
            <SettingsStack.Screen name="My Profile" component={ProfileScreen} />
            <SettingsStack.Screen name="HouseDetails" component={HouseDetailsScreen} />
            <SettingsStack.Screen name="Property List" component={HouseDetailsScreen} />
            <SettingsStack.Screen name="Profile Edit" component={UpdateProfileScreen} />


          </SettingsStack.Navigator>
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
};
const WelcomeScreen = ({navigation}) => {
  return (
    <Onboarding
      onDone={() => navigation.replace('Login')}
      onSkip={() => navigation.replace('Login')}
      pages={[
        {
          backgroundColor: '#fcba03',
          image: <Image source={require('./assets/home.png')} style={{width: 200, height: 200}}/>,
          title: 'Rent Wise',
          subtitle: 'An app to help you find your next home',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('./assets/review.png')} style={{width: 200, height: 200}}/>,
          title: 'Connect with previous tenants',
          subtitle: 'Contribute and review your experience',
        },
        {
          backgroundColor: '#8acfd4',
          image: <Image source={require('./assets/movein.png')} style={{width: 200, height: 200}}/>,
          title: 'Moving Date?',
          subtitle: 'Enjoy your new home! ',
        },
      ]}
    />);
};

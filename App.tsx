/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home';
import Splash from './screens/Splash';
import RNFS from 'react-native-fs';

const Stack = createNativeStackNavigator();

const navigationRef = React.createRef();

function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

function App({ navigation }): JSX.Element {
  const [isLoading, setLoading] = useState(true);
  const [isOnboardingCompleted, setOnboarding] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user');
      if (jsonValue) setOnboarding(true);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  }

  function loadAvatar() {
    const avtFile = RNFS.DocumentDirectoryPath + "/avatar.jpg";
    RNFS.exists(avtFile)
      .then((res) => {
        if (res) {
          console.log('avatar exists and loaded', avtFile);
          setAvatar("file:///" + avtFile);
        }
      })
      .catch(error => console.error(error))
  }

  useEffect(() => {
    setLoading(true);
    const user = getData();
    loadAvatar();
    setLoading(false);
  }, []);

  if (isLoading) {
    // We haven't finished reading from AsyncStorage yet
    return <Splash />;
  }

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // The screen is focused
  //     loadAvatar();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  const logo = require("./assets/img/Logo.png");
  const appHeader = function (props) {
    return (
      <View style={styles.header}>
        <Image key='logo'
          style={styles.appImage}
          source={logo}
          resizeMode='contain'
        />

        <TouchableOpacity onPress={() => { navigate('Profile', {}) }} style={styles.avatarButton}>
          {avatar && <Image key='avatar'
            style={styles.avatar}
            source={{ uri: avatar }}
            resizeMode='contain'
          />}
          {!avatar && (<Text>Profile</Text>)}
        </TouchableOpacity>
      </View>)
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{
        headerTitle: appHeader
      }}>
        {isOnboardingCompleted ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
          </>
        ) :
          (
            <>
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="Home" component={Home} />
            </>
          )}
      </Stack.Navigator>
    </NavigationContainer >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    borderWidth: 0,
    borderColor: 'blue',
    marginLeft: -20,
    marginVertical: 10,

  },
  appImage: {
    width: 200,
    borderWidth: 0,
    borderColor: 'blue',
  },
  avatarButton: {
    width: 60,
    justifyContent: 'flex-end',
    borderWidth: 0,
    borderColor: 'blue',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
  }
});
export default App;

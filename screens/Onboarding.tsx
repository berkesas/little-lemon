/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    Button,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding({ navigation }): JSX.Element {
    const [firstname, setFirstname] = useState();
    const [email, setEmail] = useState();

    const storeData = async () => {
        try {
            const jsonValue = JSON.stringify({ firstname: firstname, email: email });
            await AsyncStorage.setItem('@user', jsonValue);
            Alert.alert('Profile information saved.');
            navigation.push('Profile');
        } catch (e) {
            // saving error
        }
    }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user');
            if (jsonValue) {
                const user = JSON.parse(jsonValue);
                setFirstname(user.firstname);
                setEmail(user.email);
                return user;
            } else {
                setFirstname("");
                setEmail("");
            }
            // console.log(JSON.parse(jsonValue).email);
            return true;
        } catch (e) {
            // error reading value
        }
    }

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         // The screen is focused
    //         const user = getData();
    //         if (user) {
    //             navigation.navigate('Home');
    //         }
    //     });
    //     return unsubscribe;
    // }, [navigation]);

    const logo = require("../assets/img/Logo.png");
    return (
        <View
            behavior='position'
            style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={logo} />
            </View>
            <View style={styles.midpanel}>
                <Text style={styles.intro}>Welcome to Little Lemon App</Text>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} onChangeText={newText => setFirstname(newText)} defaultValue={firstname} />
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} onChangeText={newText => setEmail(newText)} defaultValue={email} />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={storeData} style={styles.button}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'flex-start'
    },
    header: {
        alignContent: 'center',
    },
    midpanel: {
        alignItems: 'center',
    },
    footer: {
        alignItems: 'flex-end',
        padding: 20,
    },
    logo: {
        marginTop: 20,
        alignSelf: "center",
        width: 250,
        height: 60,

    },
    intro: {
        margin: 10,
        fontSize: 20,
        fontWeight: "bold"
    },
    label: {
        margin: 10,
        marginBottom: 5,
        fontSize: 15,
        color: '#495E57',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        marginTop: 5,
        fontSize: 15,
        width: '95%',
        color: '#495E57',
        padding: 10,
    },
    button: {
        borderRadius: 10,
        backgroundColor: '#DEDEDE',
        margin: 5,
        padding: 10,
    },
    buttonText: {
        color: '#000000',
        fontSize: 15,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
});

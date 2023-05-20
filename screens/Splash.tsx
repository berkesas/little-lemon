/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    Button,
    TouchableOpacity,
} from 'react-native';

export default function Splash(): JSX.Element {
    const [firstname, setFirstname] = useState();
    const [email, setEmail] = useState();

    const logo = require("../assets/img/Logo.png");
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={logo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEFEE',
        justifyContent: 'space-around'
    },
    logo: {
        
    }
});

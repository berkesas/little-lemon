/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    Button,
    TouchableOpacity, Alert,
    Platform,
    ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaskInput, { Masks } from 'react-native-mask-input';
import CheckBox from '@react-native-community/checkbox';
import RNFS from 'react-native-fs';
const includeExtra = true;

export default function Profile({ navigation }): JSX.Element {
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [email, setEmail] = useState();
    const [phonenumber, setPhonenumber] = useState();
    const [checkboxes, setCheckboxes] = useState({
        order: false,
        password: false,
        special: false,
        newsletter: false,
    });
    const [response, setResponse] = React.useState<any>(null);
    const [avatar, setAvatar] = useState(null);
    const [avatarChanged, setAvatarChanged] = useState(false);

    const storeData = async () => {
        try {
            const jsonValue = JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                email: email,
                phonenumber: phonenumber,
                checkboxes: checkboxes,
            });
            console.log('saving phone number as', phonenumber);
            await AsyncStorage.setItem('@user', jsonValue);
            saveAvatar();
            Alert.alert('Profile information saved.');
        } catch (e) {
            // saving error
        }
    }

    const captureImage = React.useCallback((type, options) => {
        if (type === 'capture') {
            launchCamera(options, handleResponse);
        } else {
            launchImageLibrary(options, handleResponse);
        }
        if (response?.assets) {
            response?.assets.map(({ uri }: { uri: string }) => {
                //save image
                console.log(uri);
            });
        }
    }, []);

    function handleResponse(res) {
        setResponse(res);
        if (res?.assets) {
            const uri = res?.assets[0].uri;
            setAvatar(uri);
            setAvatarChanged(true);
            console.log(uri);
            console.log(RNFS.DocumentDirectoryPath);
        }
    }

    function saveAvatar() {
        if (!avatarChanged) return;
        const avtFile = RNFS.DocumentDirectoryPath + "/avatar.jpg";
        RNFS.exists(avtFile)
            .then((res) => {
                if (res) {
                    console.log('delete old avatar');
                    RNFS.unlink(avtFile);
                }
            })
            .catch(error => console.error(error))
        if (avatar) {
            RNFS.exists(avatar)
                .then((res) => {
                    if (res) {
                        RNFS.copyFile(avatar, avtFile)
                            .then((res) => {
                                console.log('avatar saved at', avtFile);
                            })
                            .catch(error => console.error(error))
                    } else {
                        console.log('temp avatar file does not exist');
                    }
                })
                .catch(error => console.error(error))
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

    function deleteAvatar() {
        const avtFile = RNFS.DocumentDirectoryPath + "/avatar.jpg";
        RNFS.exists(avtFile)
            .then((res) => {
                if (res) {
                    setAvatar(null);
                    console.log('deleted avatar');
                    RNFS.unlink(avtFile);
                } else {
                    console.log('file does not exist', avtFile);
                }
            })
            .catch(error => console.error(error))
    }

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('@user');
            deleteAvatar();
        } catch (e) {
            // saving error
        }
        navigation.navigate('Home');
    }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user');
            if (jsonValue) {
                const user = JSON.parse(jsonValue);
                setFirstname(user.firstname);
                setLastname(user.lastname);
                setPhonenumber(user.phonenumber);
                console.log('loading phone number as', user.phonenumber);
                setEmail(user.email);
                setCheckboxes(user.checkboxes);
                console.log(user);
            };
            loadAvatar();
            // console.log(JSON.parse(jsonValue).email);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }

    function handleCheckboxes(name, value) {
        const newCheckboxes = { ...checkboxes };
        newCheckboxes[name] = value;
        setCheckboxes(newCheckboxes);
    }

    useEffect(() => {
        const user = getData();
    }, []);

    const logo = require("../assets/img/Logo.png");
    return (
        <KeyboardAwareScrollView>
            <View style={styles.midpanel}>
                <Text style={styles.intro}>Avatar</Text>
                <View style={styles.avatar}>
                    <View style={styles.imageContainer}>
                        {avatar &&
                            <Image
                                resizeMode="cover"
                                resizeMethod="scale"
                                style={styles.image}
                                source={{ uri: avatar }}
                            />
                        }
                        {!avatar && <View style={styles.circle}><Text style={styles.initials}>{firstname?.substr(0, 1)}{lastname?.substr(0, 1)}</Text></View>}
                    </View>
                    <TouchableOpacity onPress={() => captureImage('capture', {
                        saveToPhotos: true,
                        mediaType: 'photo',
                        includeBase64: false,
                        includeExtra,
                    })} style={styles.button}>
                        <Text style={styles.buttonText}>Change</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { deleteAvatar() }} style={styles.button}>
                        <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.intro}>Personal information</Text>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} onChangeText={newText => setFirstname(newText)} defaultValue={firstname} />
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} onChangeText={newText => setLastname(newText)} defaultValue={lastname} />
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} onChangeText={newText => setEmail(newText)} defaultValue={email} />
                <Text style={styles.label}>Phone Number</Text>
                <MaskInput
                    mask={Masks.USA_PHONE}
                    value={phonenumber}
                    onChangeText={(masked, unmasked) => { setPhonenumber(masked) }}
                    style={styles.input}
                    defaultValue={phonenumber}
                />
                <Text style={styles.intro}>Email notifications</Text>
                <View>
                    <View style={styles.checkbox}>
                        <CheckBox
                            value={checkboxes?.order}
                            hideBox={true}
                            onValueChange={(value) => {
                                handleCheckboxes('order', value);
                            }}
                        /><Text>Order statuses</Text>
                    </View>
                    <View style={styles.checkbox}>
                        <CheckBox
                            value={checkboxes?.password}
                            hideBox={true}
                            onValueChange={(value) => {
                                handleCheckboxes('password', value);
                            }}
                        /><Text>Password changes</Text>
                    </View>
                    <View style={styles.checkbox}>
                        <CheckBox
                            value={checkboxes?.special}
                            hideBox={true}
                            onValueChange={(value) => {
                                handleCheckboxes('special', value);
                            }}
                        /><Text>Special offers</Text>
                    </View>
                    <View style={styles.checkbox}>
                        <CheckBox
                            value={checkboxes?.newsletter}
                            hideBox={true}
                            onValueChange={(value) => {
                                handleCheckboxes('newsletter', value);
                            }}
                        /><Text>Newsletter</Text>
                    </View>
                </View>

            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Home'); }} style={styles.button}>
                    <Text style={styles.buttonText}>Discard changes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={storeData} style={styles.button}>
                    <Text style={styles.buttonText}>Save changes</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEFEE',
        justifyContent: 'flex-start'
    },
    avatar: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    midpanel: {
        backgroundColor: '#ffffff',
        alignItems: 'flex-start',
    },
    footer: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        padding: 20,
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
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
    logoutButton: {
        width: '95%',
        backgroundColor: '#FFC107',
        borderRadius: 10,
        margin: 5,
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
    imageContainer: {
        margin: 10,
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 80,
    },
    circle: {
        backgroundColor: 'green',
        borderRadius: 80,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    }
});

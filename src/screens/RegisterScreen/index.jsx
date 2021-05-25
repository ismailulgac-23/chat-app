import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { auth, db } from '../../firebase';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [pageLoading, setPageLoading] = useState(true);
    const [profiles] = useState([
        { id: 0, image: "https://tibatu.com/wp-content/uploads/2020/10/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg" },
        { id: 1, image: "https://juristaslaw.com/wp-content/uploads/2021/03/e1.png" },
        { id: 2, image: "https://inovathink.com/wp-content/uploads/2020/07/770139_man_512x512.png" },
        { id: 3, image: "https://suaritmabayisi.com/wp-content/uploads/2020/02/10_avatar-512.png" },
        { id: 4, image: "https://juristaslaw.com/wp-content/uploads/2021/03/e1.png" },
        { id: 5, image: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/man_male_avatar_portrait-512.png" },
        { id: 6, image: "https://i.pinimg.com/originals/72/cd/96/72cd969f8e21be3476277d12d44c791c.png" },
        { id: 7, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG7ZHHUdN_3p6I5EAb0khNR1ESNmRw_z-vLgs-qma5nH4xSxAGC38uSZ9rldLMUTmGkfw&usqp=CAU" },
        { id: 8, image: "http://arunoommen.com/wp-content/uploads/2017/01/man-2_icon-icons.com_55041.png" }
    ]);
    const [registering, setRegistering] = useState(false);

    const clearInputs = () => {
        setUsername("");
        setPassword("");
        setRegistering(false);
    };

    function randomString(length) {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() *
                charactersLength)));
        }
        return result.join('');
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            function fetchData() {
                setPageLoading(true);
                auth.onAuthStateChanged(user => {
                    if (user) {
                        setPageLoading(false);
                        navigation.navigate("HomeScreen");
                        clearInputs();
                    } else {
                        setPageLoading(false);
                        clearInputs();
                    }
                });

            };
            fetchData();
        });
    }, []);

    const register = () => {
        if (username && password) {
            const randNumber = Math.floor(Math.random() * 9);
            let profileURL = profiles[randNumber].image;
            setRegistering(true);
            auth.createUserWithEmailAndPassword(username + '@gmail.com', password).then((user) => {
                user.user.updateProfile({
                    displayName: username,
                    photoURL: profileURL
                }).then(() => {
                    db.collection("users").doc(`${user.user.uid}`).set({
                        user_id: user.user.uid,
                        username: username,
                        profile: profileURL,
                        online: true
                    }).then(() => {
                        setRegistering(false);
                        navigation.navigate("HomeScreen");
                    }).catch(err => {
                        setRegistering(false);
                        console.log("ERROR_SIGNUP ===>", err.message);
                    });
                });
            }).catch((err) => {
                console.log("ERROR_SIGNUP_AUTH ===>", err.message);
            });

        } else {
            alert("Please do not leave blank space!");
        }

    };
    if (pageLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator style={styles.indicator} size="large" color="black" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.pageTitle}>Register</Text>
                    <View style={styles.input}>
                        <Icon style={styles.inputIcon} name="person" />
                        <TextInput onChange={({ target }) => setUsername(target.value)} style={styles.inputInner} placeholder="Username" />
                    </View>
                    <View style={styles.input}>
                        <Icon style={styles.inputIcon} name="lock" />
                        <TextInput onChange={({ target }) => setPassword(target.value)} style={styles.inputInner} placeholder="Password" secureTextEntry={true} />
                    </View>
                    <TouchableOpacity onPress={() => !registering ? register() : null}>
                        <View style={styles.inputBtn}>
                            <Icon style={styles.inputButtonIcon} name="person-add" />
                            <Text style={styles.inputButtonText}>{registering ? 'Registering...' : 'Register'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                        <View style={styles.inputBtnLogin}>
                            <Icon style={styles.inputButtonIcon} name="login" />
                            <Text style={styles.inputButtonText}>Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100 + '%',
    },
    loadingContainer: {
        flex: 1,
        display: "flex",
        width: 100 + '%',
        height: 100 + '%',
        alignItems: "center",
        justifyContent: "center"
    },
    indicator: {
        marginBottom: 8
    },
    pageTitle: {
        fontSize: 35,
        fontWeight: "bold",
        fontFamily: "Rubik",
        textAlign: "center",
        marginBottom: 20
    },
    input: {
        width: 200,
        height: 45,
        textAlign: "center",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#e5e5e5",
        borderRadius: 12,
        marginBottom: 12,
    },
    inputInner: {
        width: 200,
        height: 45
    },
    inputIcon: {
        marginHorizontal: 6,
        marginTop: 12
    },
    inputBtn: {
        width: 200,
        height: 45,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#f1f1f1",
        borderRadius: 100 / 2,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    inputBtnLogin: {
        width: 200,
        height: 45,
        display: "flex",
        flexDirection: "row",
        borderColor: "#f1f1f1",
        borderWidth: 2,
        borderRadius: 100 / 2,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginTop: 12
    },
    inputButtonIcon: {
        marginHorizontal: 6
    },
    inputButtonText: {
        marginTop: 3,
        marginRight: 12,
        fontFamily: "Rubik"
    },
    loadingText: {
        fontSize: 22,
        fontWeight: "bold",
        fontFamily: "Rubik"
    }
});

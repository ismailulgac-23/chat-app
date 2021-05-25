import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator } from 'react-native';
import { View, Dimensions, ScrollView, TextInput, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import firebaseApp, { db } from '../../firebase';
import MessageItem from './components/MessageItem';

export default function ChatScreen(props) {
    const messagesScroll = useRef(null);
    const { user } = props.route.params;
    const { uid } = firebaseApp.auth().currentUser;

    const [online, setOnline] = useState(user.online);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [messageSending, setMessageSending] = useState(false);

    const sendMessage = () => {
        if (message) {
            setMessageSending(true);
            db.collection("messages").doc(uid).collection(user.user_id).add({
                message_id: messages.length + 1,
                message: message,
                sender: uid
            }).then(() => {
                db.collection("messages").doc(user.user_id).collection(uid).add({
                    message_id: messages.length + 1,
                    message: message,
                    sender: uid
                }).then(() => {
                    setMessageSending(false);
                });
            });
        }
    };

    useEffect(() => {
        props.navigation.addListener("focus", () => {
            setMessagesLoading(true);
            db.collection("messages").doc(uid).collection(user.user_id).orderBy("message_id", "asc").onSnapshot('child_added', messagesData => {
                setMessages([]);
                messagesData.forEach(messageItem => {
                    if (!messageSending) setMessages(messages => [...messages, messageItem.data()]);
                    setMessage("");
                    setMessagesLoading(false);
                    messagesScroll.current.scrollIntoView({ behavior: "smooth" });
                });
                if (messages.length > 0) {
                    messagesScroll.current.scrollIntoView({ smooth: true })
                }
            });
            db.collection("users").onSnapshot("child_changed", users => {
                users.forEach(element => {
                    if (element.data().user_id === user.user_id) {
                        setOnline(element.data().online);
                    }
                });
            });
        });
    }, []);


    return (
        <View style={styles.chatContainer}>
            <View style={styles.user}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Icon style={styles.backBtn} size={28} name="arrow-left" />
                </TouchableOpacity>
                <Image source={{ uri: user.profile }} style={styles.userProfile} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.username}</Text>
                    <Text style={styles.userOnline}>{online ? 'Çevrimiçi' : 'Çevrimdışı'}</Text>
                </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.messages}>
                {!messagesLoading ? <ScrollView style={styles.messagesScroll} horizontal={false}>
                    {messages.map((message, index) => {
                        return <MessageItem key={index} message={message} />;
                    })}
                    <View ref={messagesScroll} />
                </ScrollView> : <ActivityIndicator style={styles.messagesLoadingIndicator} size="large" color="black" />}
            </View>

            <View style={styles.form}>
                <TextInput value={message} onChangeText={(e) => setMessage(e)} style={styles.formInput} placeholder="Your message" />
                <TouchableOpacity onPress={() => sendMessage()}>
                    {messageSending ? <ActivityIndicator style={styles.formIcon} size="small" color="black" /> : <Icon style={styles.formIcon} color="#f9f9f9" name="send" />}
                </TouchableOpacity>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    chatContainer: {
        width: 100 + '%',
        height: 100 + '%',
        backgroundColor: "#f9f9f9",
    },
    divider: {
        borderWidth: 1,
        borderColor: "#eee"
    },
    form: {
        display: "flex",
        flexDirection: "row",
        width: 100 + '%',
        justifyContent: "space-between",
        borderColor: "#eee",
        borderTopWidth: 1,
        backgroundColor: "#FB6D62",
        height: 50,
    },
    formInput: {
        backgroundColor: "#fff",
        width: 100 + '%',
        paddingLeft: 8
    },
    formIcon: {
        padding: 12
    },
    messagesLoadingIndicator: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "row",
        paddingTop: 12
    },
    messagesScroll: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    messages: {
        height: Dimensions.get('window').height - 139
    },
    user: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 16,
        paddingLeft: 35,
        alignItems: "center"
    },
    userProfile: {
        width: 55,
        height: 55,
        borderRadius: 55
    },
    userInfo: {
        marginLeft: 12,
        marginTop: 3
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Rubik"
    },
    userOnline: {
        fontSize: 15,
        fontFamily: "Rubik"
    },
});
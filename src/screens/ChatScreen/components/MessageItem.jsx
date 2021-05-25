import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import firebaseApp from '../../../firebase'

export default function MessageItem({ message }) {
    const { uid } = firebaseApp.auth().currentUser;

    const renderMyMessage = () => {
        return (
            <View style={styles.myMessage}>
                <Text style={styles.myMessageText}>
                    {message.message}
                </Text>
            </View>
        )
    };

    const renderOtherMessage = () => {
        return (
            <View style={styles.otherMessage}>
                <Text style={styles.otherMessageText}>
                    {message.message}
                </Text>
            </View>
        )
    };

    return message.sender === uid ? renderMyMessage() : renderOtherMessage();
}

const styles = StyleSheet.create({
    myMessage: {
        width: 200,
        minWidth: 200,
        backgroundColor: "#FB6D62",
        borderRadius: 12,
        padding: 12,
        alignSelf: "flex-start",
        marginBottom: 4
    },
    myMessageText: {
        fontWeight: "bold",
        fontFamily: "Rubik",
        fontSize: 12,
        color: "#f9f9f9"
    },
    otherMessageText: {
        fontWeight: "bold",
        fontFamily: "Rubik",
        fontSize: 12,
        color: "#676767"
    },
    otherMessage: {
        minWidth: 200,
        width: 200,
        backgroundColor: "#DDDDDD",
        padding: 12,
        borderRadius: 12,
        alignSelf: "flex-end",
        marginBottom: 4
    }
})
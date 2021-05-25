import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'

export default function UserItem({ navigation, user }) {
    return (
        <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", { user: user })}>
            <View style={styles.user}>
                <Image source={{ uri: user.profile }} style={styles.userProfile} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.username}</Text>
                    <Text style={styles.userOnline}>{user.online ? 'Çevrimiçi' : 'Çevrimdışı'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    user: {
        flex: 1,
        display: "flex",
        flexDirection: "row"
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
    }
})

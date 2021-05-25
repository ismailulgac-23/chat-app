import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import firebaseApp from '../../firebase';
import firebase, { auth, db } from '../../firebase';
import UserItem from './components/UserItem';

export default function HomeScreen({ navigation }) {

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    navigation.addListener('focus', () => {
      function fetchData() {
        auth.onAuthStateChanged(user => {
          if (!user) navigation.navigate("LoginScreen");
          else {
            db.collection("users").onSnapshot("child_changed", users => {
              setUsersLoading(true);
              var arr = [];
              users.forEach(element => {
                if (element.data().user_id !== firebase.auth().currentUser.uid) {
                  arr.push(element.data());
                  setUsersLoading(false);
                }
              });
              setUsers(arr);
            });
          }
        });
      };
      fetchData();
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Chats</Text>
        <TouchableOpacity onPress={() => {
          db.collection("users").doc(firebaseApp.auth().currentUser.uid).update({
            "online": false
          }).then(() => {
            firebaseApp.auth().signOut();
            navigation.navigate("LoginScreen");
          });
        }}>
          <View style={styles.logoutBtn}>
            <Icon name="logout" size={32} color="red" />
          </View>
        </TouchableOpacity>
      </View>

      {usersLoading ? (
        <View style={styles.loadingIndicatorContainer}>
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="black" />
        </View>
      ) : (
        users.map((user, index) => {
          return <UserItem key={index} navigation={navigation} user={user} />;
        })
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100 + '%',
    backgroundColor: '#f9f9f9',
    paddingTop: 46,
    paddingHorizontal: 33
  },
  header: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30

  },
  pageTitle: {
    fontSize: 45,
    fontFamily: "Rubik",
  },
  divider: {
    borderWidth: 2,
    borderColor: "#DDD"
  },
  loadingIndicatorContainer: {
    alignItems: "center",
    display: "flex",
    flex: 1,
  },
});

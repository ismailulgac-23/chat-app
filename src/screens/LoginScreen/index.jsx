import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { auth, db } from '../../firebase';
import { Icon } from 'react-native-elements';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logging, setLogging] = useState(false);

  const clearInputs = () => {
    setUsername("");
    setPassword("");
    setLogging(false);
  };

  const getUserInfo = (uid) => {
    return new Promise((resolve) => {
      db.collection("users").doc(`${uid}`).get().then(user => {
        resolve(user.data());
      });
    });
  };

  const login = () => {
    if (username && password) {
      setLogging(true);
      auth.signInWithEmailAndPassword(username + '@gmail.com', password).then(async (userLogin) => {
        const user = await getUserInfo(userLogin.user.uid);
        userLogin.user.updateProfile({
          photoURL: user.profile,
          displayName: user.username
        }).then(() => {
          db.collection("users").doc(`${user.user_id}`).update({
            "online": true
          });
          clearInputs();
          navigation.navigate("HomeScreen");
        });
      }).catch(err => {
        clearInputs();
        console.log("ERROR ===>", err.message);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.pageTitle}>Login</Text>
        <View style={styles.input}>
          <Icon style={styles.inputIcon} name="person" />
          <TextInput value={username} onChangeText={(e) => setUsername(e)} style={styles.inputInner} placeholder="Username" />
        </View>
        <View style={styles.input}>
          <Icon style={styles.inputIcon} name="lock" />
          <TextInput value={password} onChangeText={(e) => setPassword(e)} style={styles.inputInner} placeholder="Password" secureTextEntry={true} />
        </View>
        <TouchableOpacity onPress={() => !logging ? login() : null}>
          <View style={styles.inputBtn}>
            <Icon style={styles.inputButtonIcon} name="login" />
            <Text style={styles.inputButtonText}>{logging ? 'Logging...' : 'Login'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <View style={styles.inputBtnRegister}>
            <Icon style={styles.inputButtonIcon} name="person-add" />
            <Text style={styles.inputButtonText}>Register</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
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
  inputBtnRegister: {
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
    fontFamily: "Rubik",
    fontWeight: "bold"
  }
});

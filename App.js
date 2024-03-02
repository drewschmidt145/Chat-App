import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StyleSheet, Alert, LogBox } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { getStorage } from "firebase/storage";

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

LogBox.ignoreLogs(["AsyncStorage has been extracted from"])

const Stack = createNativeStackNavigator();

const App = () => {
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    } 
  }, [connectionStatus.isConnected]);

  const firebaseConfig = {
    apiKey: "AIzaSyB3ctHJt0prxrbQGqR7MOcMDelAiDsvvYw",
    authDomain: "chatapp-1e2fe.firebaseapp.com",
    projectId: "chatapp-1e2fe",
    storageBucket: "chatapp-1e2fe.appspot.com",
    messagingSenderId: "437100808075",
    appId: "1:437100808075:web:7ef6b8d72c1b851cf2d18e",
    measurementId: "G-30NB87LF0F"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const storage = getStorage(app);

  return (
    <NavigationContainer styles={styles.container}>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name='Start'
          component={Start}
        />
        <Stack.Screen
          name='Chat'
        >
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

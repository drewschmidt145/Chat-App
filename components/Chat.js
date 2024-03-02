import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, orderBy, query, DocumentSnapshot} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps'

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const [ messages, setMessages ] = useState([])
    const { name, background, userID } = route.params;

    let unsubMessages;

    useEffect(() => {
      // uses the name that is enters for navbar
      navigation.setOptions({ title: name });

      // query for collections messages in descending order
      if (isConnected === true) {

        if (unsubMessages) unsubMessages();
        unsubMessages = null;

        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        unsubMessages = onSnapshot(q, (docs) => {
          let newMessages = [];
          docs.forEach(doc => {
            newMessages.push({
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis())
            })
          });
          cacheMessages(newMessages);
          setMessages(newMessages);
        });
      } else loadCachedMessages();

      // clean up code for updated messages
      return () => {
        if (unsubMessages) unsubMessages();
      }
    }, [isConnected]);
    
    // function to send new messages to firestore
    const onSend = (newMessages) => {
      addDoc(collection(db, "messages"), newMessages[0]);
    };

    // renders chat bubbles and allows styling,, colors for the bubbles
    const renderBubble = (props) => {
        return <Bubble 
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: 'white',
            },
            right: {
              backgroundColor: 'green',
            }
          }}
    
        />;
    }

    const renderInputToolbar = (props) => {
      if (isConnected) return <InputToolbar {...props} />;
      else return null;
    }

    const cacheMessages = async (messagesToCache) => {
      try {
        await AsyncStorage.setItem('chat_messages', JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      }
    }

    const loadCachedMessages = async () => {
      const cachedMessages = await AsyncStorage.getItem("chat_messages") || [];
      setMessages(JSON.parse(cachedMessages));
    }

    const renderCustomActions = (props) => {
      return <CustomActions storage={storage} {...props} />;
    };

    const RenderCustomView = (props) => {
      const { currentMessage } = props;
      if (currentMessage.location) {
        return (
          <MapView 
            style={{
              width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3
            }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        )
      };
      return null;
    }

    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <GiftedChat
                messages={messages}
                renderInputToolbar={renderInputToolbar}
                renderBubble={renderBubble}
                renderActions={renderCustomActions}
                renderCustomView={RenderCustomView}
                onSend={messages => onSend(messages)}
                user={{
                  _id: userID,
                  name: name
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="height" />: null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;
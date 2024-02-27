import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, orderBy, query, DocumentSnapshot} from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
    const [ messages, setMessages ] = useState([])
    const { name, background, userID } = route.params;

    
    useEffect(() => {
      // uses the name that is enters for navbar
      navigation.setOptions({ title: name });

      // query for collections messages in descending order
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        })
        setMessages(newMessages);
      })
      // clean up code for updated messages
      return () => {
        if (unsubMessages) unsubMessages();
      }
    }, []);
    
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

    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                  _id: userID,
                  name: name
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;
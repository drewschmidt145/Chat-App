import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
    const [ messages, setMessages ] = useState([])
    const { name, background } = route.params;
    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    }

    useEffect(() => {
        setMessages([
          {
            _id: 1,
            text: "Hello, Welcome to the Chat Room!",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "React Native",
              avatar: "https://picsum.photos/140/140",
            },
          },
          {
            _id: 2,
            text: 'This is a system message',
            createdAt: new Date(),
            system: true,
          },
        ]);
    }, []);

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    const renderBubble = (props) => {
        return <Bubble {...props}
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
                _id: 1
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;
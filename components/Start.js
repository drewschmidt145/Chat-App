import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Platform, Image, KeyboardAvoidingView } from 'react-native';


const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [background, setBackground] = useState('');
    const image = require('../img/BackgroundImage.png');
    const icon = require('../img/icon.png');
    const colors = ['#659DBD', '#DAAD86', '#BC986A', '#FBEEC1'];

    return (
        <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <Text style={styles.text}>Chat App</Text>
          <View style={styles.containerWhite}>
            <View style={styles.inputContainer}>
              <Image source={icon} style={styles.icon} />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#757083"
              />
            </View>
            <Text style={styles.text1}>Choose Background Color:</Text>
            <View style={styles.colorButtonsContainer}>
                {colors.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.colorButton, { backgroundColor: color }, background === color && styles.selected]}
                        onPress={() => setBackground(color)}
                    />
                ))}
            </View>  
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Chat Button"
              accessibilityHint="Sends you to a chat room to start chatting!"
              accessibilityRole="button"
              onPress={() => navigation.navigate('Chat',  { name: name ,  background: background } )}
              style={styles.button}
            >
                <Text style={styles.buttonText} >Start Chatting</Text>
            </TouchableOpacity>
          </View>
          {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" />: null}
          {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </ImageBackground>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
    },
    containerWhite: {
        width: '88%',
        height: '44%',
        justifyContent: 'center',
        backgroundColor: 'white',
        bottom: 0,
        alignItems: 'center',
        marginBottom: '6%',
    },
    text: {
        padding: '25%',
        flex: 6,
        fontSize: 45,
        fontWeight: '600',
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#757083',
        padding: 18,
        marginLeft: 20,
        marginRight: 20,
        marginTop: -10,
        marginBottom: 10,
        opacity: '50%',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    text1: {
        fontSize: 16,
        color: '#757083',
        fontWeight: '300',
        opacity: 1,
        marginTop: 10,
    },
    colorButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
    },
    button: {
        width: '88%',
        margin: 20,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#757083',
      },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default Start;

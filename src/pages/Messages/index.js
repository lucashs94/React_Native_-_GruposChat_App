import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, FlatList, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import { Feather } from '@expo/vector-icons'

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import ChatMessage from '../../Components/ChatMessage'


export default function Messages({ route }) {

  const { item } = route.params
  const user = auth().currentUser.toJSON()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')


  useEffect(() => {

    const listener = firestore().collection('MESSAGE_THREADS')
    .doc(item._id)
    .collection('MESSAGES')
    .orderBy('createdAt', 'DESC')
    .onSnapshot( snap => {
      const msg = snap.docs.map( doc => {
        const docData = doc.data()

        const data = {
          _id: doc.id,
          text: '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          ...docData,
        }

        if(!docData.system){
          data.user = {
            ...docData.user,
            name: docData.user.displayName, 
          }
        }
        return data
      })

      setMessages(msg)
    })
    
    return () => { listener() }
  }, [])


  async function handleSendMessage(){
    if(input === '') return

    await firestore().collection('MESSAGE_THREADS').doc(item._id)
    .collection('MESSAGES').add({
      text: input,
      createdAt: firestore.FieldValue.serverTimestamp(),
      user:{
        _id: user.uid,
        displayName: user.displayName,
      }
    })

    await firestore().collection('MESSAGE_THREADS').doc(item._id)
    .set(
      {
        lastMessage: {
          text: input,
          createdAt: firestore.FieldValue.serverTimestamp(),
        }
      },
      { merge: true}
    )

    setInput('')
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList 
        style={{width: '100%',}}
        showsVerticalScrollIndicator={false}
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <ChatMessage item={item} />
        )}
        inverted={true}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{width: '100%',}}
        keyboardVerticalOffset={100}
      >
        <View style={styles.containerInput}>
          <View style={styles.mainContainerInput}>
            <TextInput
              style={styles.messageInput}
              placeholder='Sua mensagem...'
              value={input}
              onChangeText={setInput}
              multiline={true}
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            activeOpacity={0.6}
            onPress={handleSendMessage}
          >
            <View style={styles.buttonContainer}>
              <Feather name='send' size={22} color='#FFF'/>
            </View>
          </TouchableOpacity>
        </View>
      
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerInput:{
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
  },
  mainContainerInput:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    marginRight: 10,
    paddingVertical: 8,
  },
  messageInput:{
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 130,
    minHeight: 28,
    // paddingTop: 6,
    paddingLeft: 5,
  },
  buttonContainer:{
    backgroundColor: '#51c880',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    borderRadius: 20,
  }
})
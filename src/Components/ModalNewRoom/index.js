import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

export default function ModalNewRoom({ setVisible }) {

  const [roomName, setRoomName] = useState('')
  
  const user = auth().currentUser.toJSON()

  
  async function handleCreateRoom(){
    if(roomName === '') return

    await firestore().collection('MESSAGE_THREADS').get()
    .then( snap => {
      let myDocs = 0

      snap.docs.map( doc =>{
        if(doc.data().owner === user.uid){
          myDocs += 1
        }
      })

      if(myDocs >=4){
        alert('Você atingiu o limite de grupos por usuário.')
        setVisible()
      }else{
        createRoom()
      }
    })
  }

  async function createRoom(){
    await firestore().collection('MESSAGE_THREADS')
    .add({
      name: roomName,
      owner: user.uid,
      lastMessage:{
        text: `Grupo ${roomName} criado. Bem vindo(a)!`,
        createdAt: firestore.FieldValue.serverTimestamp(),
      },
    })
    .then((docRef)=>{
      docRef.collection('MESSAGES')
      .add({
        text: `Grupo ${roomName} criado. Seja bem vindo!`,
        createdAt: firestore.FieldValue.serverTimestamp(),
        system: true,
      })
      .then(()=>{
        setVisible()
      })
    })
    .catch(error => {
      console.log(error)
    })
  }


  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior= {Platform.OS === 'android' ? '': 'padding'}
    >
      <TouchableWithoutFeedback
        onPress={setVisible}
      >
        <View style={styles.modal}></View>
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.title}>Criar um novo grupo?</Text>
        <TextInput
          style={styles.input}
          value={roomName}
          onChangeText={setRoomName}
          placeholder='Nome para sua sala'
          autoCapitalize='none'
        />

        <TouchableOpacity 
          style={styles.buttonCreate}
          onPress={handleCreateRoom}
        >
          <Text style={styles.buttonText}>Criar sala</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'rgba(34,34,34,0.4)'
  },
  modal:{
    flex: 1,
  },
  modalContent:{
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
  },
  title:{
    marginTop: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
  },
  input:{
    borderRadius: 4,
    height: 45,
    backgroundColor: '#DDD',
    marginVertical: 15,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  buttonCreate:{
    borderRadius: 4,
    backgroundColor: '#2e54d4',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  buttonText:{
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFF', 
  }
})
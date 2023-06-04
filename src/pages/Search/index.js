import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import { MaterialIcons } from '@expo/vector-icons'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import ChatList from '../../Components/ChatList'

export default function Search() {
  const isFocused = useIsFocused()

  const [input, setInput] = useState('')
  const [user, setUser] = useState(null)
  const [chats, setChats] = useState([])


  useEffect(() => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null
    setUser(hasUser)

  }, [isFocused])


  async function handleSearch(){
    if(input === '') return

    await firestore().collection('MESSAGE_THREADS')
    .where('name', '>=', input)
    .where('name', '<=', input + '\uf8ff')
    .get()
    .then( (snapshot) => {
      const threads = snapshot.docs.map( doc => {
        return {
          _id: doc.id,
          name: '',
          lastMessage: { text: '' },
          ...doc.data(),
        }
      }) 

      setChats(threads)
      setInput('')
      Keyboard.dismiss()
    })

  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content'/>

      <View style={styles.containerInput}>
        <TextInput
          placeholder='Digite o nome da sala...'
          value={input}
          onChangeText={setInput}
          style={styles.input}
          autoCapitalize='none'
        />

        <TouchableOpacity 
          style={styles.buttonSearch}
          onPress={handleSearch}
        >
          <MaterialIcons name='search' size={30} color='#FFF' />
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={chats}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <ChatList 
            item={item}  
            userStatus={user}
          />
        )}
      />
    </SafeAreaView>
  )
}

 
const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#FFF',
  },
  containerInput:{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 14,
  },
  input:{
    backgroundColor: '#ebebeb',
    marginLeft: 10,
    height: 50,
    width: '80%',
    borderRadius: 4,
    padding: 5,
  },
  buttonSearch:{
    backgroundColor: '#2e54d4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    marginLeft: 5,
    marginRight: 10,
  }
})
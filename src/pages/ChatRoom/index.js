import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Modal, StyleSheet, StatusBar, ActivityIndicator, FlatList, Alert, Platform } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native' 

import { MaterialIcons } from '@expo/vector-icons'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import FabButton from '../../Components/FabButton'
import ModalNewRoom from '../../Components/ModalNewRoom'
import ChatList from '../../Components/ChatList'


export default function ChatRoom() {

  const navigation = useNavigation()
  const isFocused = useIsFocused()
  
  const [user, setUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null
    setUser(hasUser)

  }, [isFocused])


  useEffect(() => {
    let isActive = true

    function getChats(){
      firestore().collection('MESSAGE_THREADS')
      .orderBy('lastMessage.createdAt', 'desc')
      .limit(10)
      .get()
      .then((snapshot)=>{
        const threads = snapshot.docs.map( doc => {
          return{
            _id: doc.id,
            name: doc.data().name,
            lastMessage: { text: ''},
            ...doc.data(),
          }
        })

        if(isActive){
          setThreads(threads)
          setLoading(false)
        }
      })
      .catch(error => {})

    }
    getChats()

    return () => {isActive = false} 
  }, [isFocused, threads])


  function handleDeleteRoom(ownerId, idRoom){
    if(ownerId !== user?.uid) return

    Alert.alert(
      'Atenção!!',
      'Você tem certeza que deseja excluir este grupo?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteChat(idRoom),
        }
      ]
    )
  } 

  async function deleteChat(idRoom){
    await firestore().collection('MESSAGE_THREADS')
    .doc(idRoom)
    .delete()
  }


  function handleSignOut(){
    auth().signOut()
    .then(() => {
      setUser(null)
      navigation.navigate('SignIn')
    })
    .catch(error => {
      console.log('Não possui usuario')
    })
  }


  return (
    <>
    <SafeAreaView style={{ flex: 0, backgroundColor: '#2e54d4', color: '#FFF' }}/>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? "light-content" : "dark-content"} translucent={false}/>

      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>

          {user && (
            <TouchableOpacity onPress={handleSignOut}>
              <MaterialIcons name='arrow-back' size={28} color='#FFF'/>
            </TouchableOpacity> 
          )}

          <Text style={styles.title}>Grupos</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Search')}
        >
          <MaterialIcons name='search' size={28} color='#FFF'/>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex:1,justifyContent: 'center', alignItems:'center'}}>
          <ActivityIndicator size='large' color='#555'/>
        </View>
      ):(
        <FlatList
          showsVerticalScrollIndicator={false}
          data={threads}
          keyExtractor={ item => item._id }
          renderItem={({ item }) => (
            <ChatList 
              item={item}  
              deleteRoom={ () => handleDeleteRoom(item.owner, item._id) }
              userStatus={user}
            />
          )}
        />
      )}

      <FabButton 
        setVisible={() => setModalVisible(true)} 
        userStatus={user}
      />
      
      <Modal 
        visible={modalVisible}
        animationType='fade'
        transparent={true}
      >
        <ModalNewRoom setVisible={() => setModalVisible(false)} />
      </Modal>

    </SafeAreaView>
    </>
  )
}



const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRoom:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2e54d4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerRoomLeft:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  title:{
    fontSize: 26,
    fontWeight: 'bold',
    color : '#FFF',
    paddingLeft: 10,
  }
})
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export default function ChatMessage({ item }) {

  const user = auth().currentUser.toJSON()

  const isMyMessage = useMemo(() => {
    return item?.user?._id === user.uid
  }, [item])

  return (
    <View style={styles.container}>

      <View style={[
        styles.messageBox,
        {
          backgroundColor: isMyMessage ? '#DCF8C5' : '#fff',
          marginLeft: isMyMessage ? 50 : 0,
          marginRight: isMyMessage ? 0 : 50,
        }
      ]}>
        {!isMyMessage && item?.user && 
          (<Text style={styles.name}>{item?.user?.displayName}</Text>)
        }
        <Text style={styles.message}>{item.text}</Text>

      </View>

    </View>
  )
}


const styles = StyleSheet.create({
  container:{
    paddingHorizontal: 10,
  },
  messageBox:{
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  name:{
    color: '#F53745',
    fontWeight: 'bold',
    marginBottom: 5,
  }
})
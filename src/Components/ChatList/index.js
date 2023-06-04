import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'



export default function ChatList({ item, deleteRoom, userStatus }) {

  const navigation = useNavigation()

  function openChat(){
    if(userStatus){
      navigation.navigate('Messages', { item: item })
    }else{
      navigation.navigate('SignIn')
    }
  }


  return (
    <TouchableOpacity
      onPress={() => openChat()}
      onLongPress={() => deleteRoom() }
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.name}
            </Text>
          </View>

          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  row:{
    paddingHorizontal: 10,
    paddingVertical: 14,
    flexDirection:'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241,240,245, 0.9)',
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  content:{
    flexShrink: 1,
  },
  header:{
    flexDirection: 'row',
  },
  lastMessage:{
    color: '#c1c1c1',
    fontSize: 12,
    marginTop: 2,
  },
  nameText:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  }
})
import React, { useState } from 'react'
import { Text, StyleSheet, TextInput, SafeAreaView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native'

import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'

export default function SignIn() {

  const navigation = useNavigation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [type, setType] = useState(false)
  
  const [loading, setLoading] = useState(false)

  
  async function handleSignIn(){
    if(type){
      if(name === '' || email === '' || password === '') return

      setLoading(true)
      await auth().createUserWithEmailAndPassword(email, password)
      .then((user)=> {
        user.user.updateProfile({
          displayName: name,
        })
        .then(() => {
          navigation.goBack()
        })
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('Esse email já está em uso!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('Email inválido');
        }
      })
      .finally(() => {
        setLoading(false)
      })
      
    }else{
      if(email === '' || password === '') return

      setLoading(true)
      await auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.goBack()
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          console.log('Email inválido');
        }
      })
      .finally(() => {
        setLoading(false)
      })

    }
  }


  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.logo}>appChat</Text>
      <Text style={{marginBottom: 20}}>Ajude, colabore, faça networking!</Text>

      {type && (
        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder='Qual o seu nome?'
          placeholderTextColor='#99999b'
        />
      )}

      <TextInput 
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder='Qual o seu email?'
        placeholderTextColor='#99999b'
        autoCapitalize='none'
      />

      <TextInput 
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder='Digite sua senha'
        placeholderTextColor='#99999b'
        secureTextEntry={true}
      />
    
      <TouchableOpacity 
        style={[styles.buttonLogin, {backgroundColor: type ? '#f53745' : '#57dd86'}]}
        onPress={handleSignIn}
      >
        {loading ? (
          <ActivityIndicator size={25} color='#FFF'/>
        ) : (
          <Text
            style={styles.buttonText}
          >
            { type ? 'Cadastrar' : 'Acessar'}
          </Text>
        )}
      </TouchableOpacity>
    
      <TouchableOpacity onPress={() => setType(!type)}>
        <Text>
          { type ? 'Já tem uma conta? Faça login!' : 'Criar uma conta!'}
        </Text>
      </TouchableOpacity>

    
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo:{
    marginTop: Platform.OS === 'android' ? 55 : 80,
    fontSize: 28,
    fontWeight: 'bold',
  },
  input:{
    color: '#121212',
    backgroundColor: '#ebebeb',
    width: '90%',
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 50,
  },
  buttonLogin:{
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 6,
  },
  buttonText:{
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 19,
  }
})
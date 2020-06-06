import React, {useState, useEffect} from 'react'

import {Feather as Icon} from '@expo/vector-icons'
import {
    View,
    ImageBackground, 
    Image, 
    Text, 
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Picker} from 'react-native'
import {RectButton} from 'react-native-gesture-handler'
import {useNavigation} from '@react-navigation/native'

import axios from 'axios'

import styles from './styles'

interface IBGEUfResponse {
  sigla: string
}


interface IBGECityResponse {
  nome: string
}




const Home =() => {
 
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState('0')

  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')

  const navigation = useNavigation()

  useEffect(() => {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufinitials = response.data.map( uf => uf.sigla)
      setUfs(ufinitials)
    })
  }, [ufs])

  useEffect(() => {
    if(selectedUf === '0') {
      return
    }
    
    axios.get<IBGEUfResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`).then(response => {
      const ufinitials = response.data.map( uf => uf.sigla)
      setUfs(ufinitials)
    })
    
  }, [selectedUf])

  useEffect(() => {
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      const cityNames = response.data.map( city => city.nome)
      setCities(cityNames)
    })
  }, [selectedUf, ufs])

  function handleNavigateToPoints(){
    navigation.navigate('Point', {
      selectedUf,
      selectedCity
    })
  }

  return (
  <KeyboardAvoidingView style = {{flex: 1}} behavior = {Platform.OS == 'ios' ? 'padding' : undefined}>
    <ImageBackground 
       source={require('../../assets/home-background.png')} 
       style = {styles.container}
       imageStyle = {{width: 274, height: 368}}
       >
      <View style = {styles.main}> 
        <Image source={require('../../assets/logo.png')} />
        <View>
        <Text style = {styles.title} > Seu marketplace de coleta de resíduos</Text>
        <Text style = {styles.description} > Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>
      </View>    

      <View style = {styles.footer}>
        <View  style = {styles.input}>
        <Picker
        style = {styles.inputText}
         selectedValue = {selectedUf}
         onValueChange={index => setSelectedUf(index)}>
          <Picker.Item label={'Selecione uma UF'} value ='' />
              {ufs.map(uf=> {
                return (
                  <Picker.Item
                    key={uf}
                    label={uf}
                    value={uf}
                  />
                )
              })}
         </Picker>
        </View>
        
        <View style = {styles.input}>
        <Picker
         style = {styles.inputText}
         selectedValue= {selectedCity}
         onValueChange = {text => setSelectedCity(text)}>
         <Picker.Item label={'Selecione uma Cidade'} value ='' />
         {cities.map(city=> {
           return (
             <Picker.Item
               key={city}
               label={city}
               value={city}
             />
           )
         })}
        </Picker>
        </View>

        <RectButton style = {styles.button} onPress = {handleNavigateToPoints}>
          <View style = {styles.buttonIcon}> 
             <Text>
              <Icon name = "arrow-right" color="#FFFF" size = {24}/>
             </Text>
          </View>
          <Text style = {styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View> 
    </ImageBackground>
 </KeyboardAvoidingView>
  )
}

export default Home
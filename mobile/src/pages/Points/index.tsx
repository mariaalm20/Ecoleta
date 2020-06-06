import React, {useState, useEffect} from 'react'

import {View, TouchableOpacity, Text, ScrollView, Image, Alert} from 'react-native'
import {Feather as Icon} from '@expo/vector-icons'
import {useNavigation, useRoute} from '@react-navigation/native'
import MapView, {Marker} from 'react-native-maps'
import {SvgUri} from 'react-native-svg'
import * as Location from 'expo-location'

import styles from './styles'

import api from '../../sevices/api'
import Routes from '../../routes'


interface Item {
  id: number;
  title: string;
  image_url_mobile: string
}

interface Point {
  id: number,
  image: string,
  name: string,
  latitude: number,
  longitude: number,
}

interface Params {
  selectedUf: string,
  selectedCity: string
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
  const [points, setPoints] = useState<Point[]>([])

  const route = useRoute()
  const navigation = useNavigation()

  const routeParams = route.params as Params

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()
      if(status !== "granted"){
         Alert.alert('OOOPS, precisamos de sua permissão para obter a localização')
         return
      }

      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude} = location.coords

      setInitialPosition([latitude, longitude])
      console.log(latitude, longitude)
    }

    loadPosition()
  }, [])

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('points', {
      params: {
        city: routeParams.selectedCity,
        uf: routeParams.selectedUf,
        items: selectedItems
      }
    }).then(response => {
      setPoints(response.data)
      console.log(response.data)
    })
  }, [ selectedItems])

  function handleBack() {
    navigation.navigate('Home')
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', {point_id: id})
  }

  function handleSelectItem(id:number){
    const alreadySelected = selectedItems.findIndex(item => item === id)
    
    if (alreadySelected >= 0){
       const filteredItems = selectedItems.filter(item => item !== id)
       setSelectedItems(filteredItems)
    } else { 
         setSelectedItems([...selectedItems,id])
      }
  }


  return (
    <>
    <View style = {styles.container}>
      <TouchableOpacity onPress = {handleBack}>
        <Icon name = "arrow-left" size={20} color="#34cb79"/>
      </TouchableOpacity>

      <Text style = {styles.title}>Bem vindo</Text>
      <Text style = {styles.description}>Encontre no mapa um ponto de coleta</Text>
      
      <View style = {styles.mapContainer}>
        {initialPosition [0] !== 0 && (
            <MapView 
             style = {styles.map}
             initialRegion = {{
             latitude: initialPosition[0],
             longitude: initialPosition[1],
             latitudeDelta: 0.014,
             longitudeDelta:0.014
           }}>
             {points.map(point => (
               <Marker 
                  key = {String(point.id)}
                  style = {styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate = {{
                      latitude: point.latitude,
                      longitude: point.longitude,
                }}>
                    <View style = {styles.mapMarkerContainer}>
                      <Image 
                       style = {styles.mapMarkerImage}
                       source = {{uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60"}}/>
                      <Text style = {styles.mapMarkerTitle}>{point.name}</Text>
                    </View>        
                  </Marker>
             ) )}
           </MapView>
        )}
      </View>
    </View>

    <View style = {styles.itemsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator = {false}
        contentContainerStyle = {{ paddingHorizontal: 20}}
        >
          {items.map(item => (
              <TouchableOpacity 
                key={String(item.id)} 
                style = {[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : {}
               ]} 
                onPress={() => handleSelectItem(item.id)}
                activeOpacity={0.6}
                >
              <SvgUri width = {42} height ={42} uri = {item.image_url_mobile}/>
              <Text style = {styles.itemTitle}>{item.title}</Text> 
           </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
    </>

  )
}

export default Points
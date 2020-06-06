import React from 'react';
import { StatusBar } from 'react-native';
import {AppLoading, Font} from 'expo'
import {Roboto_400Regular, Roboto_500Medium, useFonts} from '@expo-google-fonts/roboto'

import Routes from './src/routes'

export default function App() {
 

  return (
    <>
    <StatusBar 
       barStyle = "dark-content" 
       backgroundColor = "transparent" 
       translucent
       />
    <Routes />
    </>
  )
  }
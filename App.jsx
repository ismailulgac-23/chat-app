import React from 'react';
import { useFonts } from 'expo-font';
import Navigator from './src/navigators';
export default function App() {
  let [fontsLoaded] = useFonts({
    'Rubik': require('./src/assets/fonts/Rubik-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return <Navigator />;
}

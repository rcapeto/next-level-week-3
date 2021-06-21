import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { MapEvent, Marker } from 'react-native-maps';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import mapMarkerImg from '../../images/map-marker.png';

export default function SelectMapPosition() {
   const [currentPosition, setCurrentPosition] = useState({ latitude: 0, longitude: 0 });
   const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
   const navigation = useNavigation();
   const isFocused = useIsFocused();

   function handleNextStep() {
      navigation.navigate('OrphanageData', { position });
   }

   async function getCurrentPosition() {
      const { granted } = await Permissions.getAsync(Permissions.LOCATION);
  
      if(!granted) {
        const { status } = await Location.getPermissionsAsync();
  
        if(status === 'granted') {
          const { coords } = await Location.getCurrentPositionAsync();
          setCurrentPosition({ latitude: coords.latitude, longitude: coords.longitude });
        }
      } else {
        const { coords } = await Location.getCurrentPositionAsync();
        setCurrentPosition({ latitude: coords.latitude, longitude: coords.longitude });
      }
    }

   useEffect(() => {
      if(isFocused) {
         getCurrentPosition();
      }
   }, [isFocused]);

   if(currentPosition.latitude === 0) {
      return(
         <View style={styles.containerLoading}>
            <ActivityIndicator size="large" color="#15C3D6" />
         </View>
      );
   }

   function handleSelectPosition(event: MapEvent) {
      const { coordinate } = event.nativeEvent;
      setPosition(coordinate);
   }

  return (
    <View style={styles.container}>
      <MapView 
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        onPress={handleSelectPosition}
        style={styles.mapStyle}
      >
       {
          position.latitude !== 0 && (
            <Marker 
               icon={mapMarkerImg}
               coordinate={{ latitude: position.latitude, longitude: position.longitude }}
            />
          )
       } 
      </MapView>
      
      {
         position.latitude !== 0 && (
            <RectButton style={styles.nextButton} onPress={handleNextStep}>
               <Text style={styles.nextButtonText}>Próximo</Text>
            </RectButton>
         )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  containerLoading: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center'
},

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import mapMarker from '../images/map-marker.png';
import api from '../services/api';

interface Orphanage {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const handleNavigateToOrphanagesDetails = useCallback((id: number) => {
    navigation.navigate('OrphanagesDetails', { id });
  }, []);

  const handleNavigateToCreateOrphanages = useCallback(() => {
    navigation.navigate('SelectMapPosition');
  }, []);

  async function getCurrentPosition() {
    const { granted } = await Permissions.getAsync(Permissions.LOCATION);

    if(!granted) {
      const { status } = await Location.getPermissionsAsync();

      if(status === 'granted') {
        const { coords } = await Location.getCurrentPositionAsync();
        setPosition({ latitude: coords.latitude, longitude: coords.longitude });
      }
    } else {
      const { coords } = await Location.getCurrentPositionAsync();
      setPosition({ latitude: coords.latitude, longitude: coords.longitude });
    }
  }

  const getOrphanages = useCallback(async () => {
    const response = await api.get('orphanages');
    setOrphanages(response.data);
  }, []);

  useEffect(() => {
    if(isFocused) {
      getOrphanages();
    }
  }, [getOrphanages, isFocused]);

  useEffect(() => {
    if(isFocused) {
      getCurrentPosition();
    }
  }, [isFocused]);

  if(position.latitude === 0) {
    return(
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#15C3D6"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        provider={PROVIDER_GOOGLE}
      >
         {
           orphanages.map(orphanage => (
            <Marker 
              icon={mapMarker}
              coordinate={{ latitude: orphanage.latitude, longitude: orphanage.longitude }}
              calloutAnchor={{ x: 2.7, y: 0.8}}
              key={orphanage.id}
            >
              <Callout tooltip onPress={() => handleNavigateToOrphanagesDetails(orphanage.id)}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                  </View>
              </Callout>
            </Marker>
           ))
         }
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

        <TouchableOpacity
          onPress={handleNavigateToCreateOrphanages}
          style={styles.footerButton}
        >
          <Feather name="plus" size={20} color="#FFF"/>  
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height
  },
  calloutContainer: {
     width: 160,
     height: 46,
     paddingHorizontal: 16,
     backgroundColor: 'rgba(255, 255, 255, 0.8)',
     borderRadius: 16,
     justifyContent: 'center',
  },
  calloutText: {
   fontSize: 15,
   color: '#0089A5'
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3
  },
  footerText: {
    color: '#8FA7B3',
    fontFamily: 'Nunito_700Bold'
  },
  footerButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15C3D6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

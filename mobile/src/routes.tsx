import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import OrphanagesMap from './pages/OrphanagesMap';
import OrphanagesDetails from './pages/OrphanagesDetails';
import SelectMapPosition from './pages/CreateOrphanage/SelectMapPosition';
import OrphanageData from './pages/CreateOrphanage/OrphanageData';
import Header from './components/Header';

const AppStack = createStackNavigator();

export default function Routes() {
   return(
      <NavigationContainer>
         <AppStack.Navigator screenOptions={{
            headerShown: false,
            cardStyle: {
               backgroundColor: '#F2F3F5'
            }
         }}>
            <AppStack.Screen 
               component={OrphanagesMap} 
               name="OrphanagesMap"
            />

            <AppStack.Screen 
               component={OrphanagesDetails} 
               name="OrphanagesDetails"
               options={{
                  headerShown: true,
                  header: () => <Header title="Orfanato" showCancel={false}/>
               }}
            />

            <AppStack.Screen 
               component={SelectMapPosition} 
               name="SelectMapPosition"
               options={{
                  headerShown: true,
                  header: () => <Header title="Selecione no Mapa" />
               }}
            />

            <AppStack.Screen 
               component={OrphanageData} 
               name="OrphanageData"
               options={{
                  headerShown: true,
                  header: () => <Header title="Informe os Dados" />
               }}
            />
         </AppStack.Navigator>
      </NavigationContainer>
   );
}
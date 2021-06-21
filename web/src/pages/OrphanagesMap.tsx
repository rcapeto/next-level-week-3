import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import '../styles/pages/orphanagesMap.css';
import mapMarkerImg from '../images/map-marker.svg';
import mapIcon from '../utils/happyIcon';
import api from '../services/api';

interface Orphanage {
   id: number;
   latitude: number;
   longitude: number;
   name: string;
}

export default function OrphanagesMap() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

   useEffect(() => {
      navigator.geolocation.getCurrentPosition(position => {
         setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
         });
      });
   }, []);

   async function getOrphanages() {
      const response = await api.get('orphanages');
      setOrphanages(response.data);
   }

   useEffect(() => {
      getOrphanages();
   }, []);

   return(
      <div id="page-map">
         <aside>
            <header>
               <img src={mapMarkerImg} alt="Happy"/>
               <h2>Escolha um orfanato no mapa.</h2>
               <p>Muitas crianças estão esperando sua visita</p>
            </header>

            <footer>
               <strong>Barueri</strong>
               <p>São Paulo</p>
            </footer>
         </aside>

         {
            position.latitude !== 0 && (
               <MapContainer 
                  center={[-23.4557997, -46.8931463]} 
                  zoom={15}
                  style={{ width: '100%', height: '100%' }}
               >
                  {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/> */}
                  <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}/>

                  {
                     orphanages.length > 0 && orphanages.map(orphanage => (
                        <Marker 
                           position={[orphanage.latitude, orphanage.longitude]} 
                           icon={mapIcon}
                           key={orphanage.id}
                        >
                           <Popup
                              closeButton={false}
                              minWidth={240}
                              maxWidth={240}
                              className="map-popup"
                           >
                              {orphanage.name}
                              <Link to={`/orphanages/${orphanage.id}`}>
                                 <FiArrowRight color="#FFF" size={20}/> 
                              </Link>
                           </Popup>
                        </Marker>
                     ))
                  } 
               </MapContainer>   
            )
         }
         <Link className="create-orphanage" to="/orphanages/create">
            <FiPlus color="#FFF" size={32}/>
         </Link>
      </div>
   );
}
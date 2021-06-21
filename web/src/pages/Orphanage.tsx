import React, { useState, useEffect, useCallback } from "react";
import { FiClock, FiInfo } from "react-icons/fi";
import { Marker, TileLayer, MapContainer } from "react-leaflet";
import { useParams } from 'react-router-dom';

import Sidebar from "../components/Sidebar";
import '../styles/pages/orphanage.css';
import happyMapIcon from '../utils/happyIcon';
import api from '../services/api';

interface OrphanageInterface {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    url: string;
  }>
}

interface RouteParams {
  id: string;
}

export default function Orphanage() {
  const params = useParams<RouteParams>();
  const [orphanage, setOrphanage] = useState<OrphanageInterface>();
  const [activeImage, setActiveImage] = useState(0);

  const getOrphanageDetail = useCallback(async () => {
    const response = await api.get(`orphanages/${params.id}`);
    setOrphanage(response.data);
  }, [params.id]);

  useEffect(() => {
    getOrphanageDetail();
  }, [getOrphanageDetail]);

  if(!orphanage) {
    return(
      <div id="page-load">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImage].url} alt={orphanage.name} /> 

          <div className="images">
            {
              orphanage.images.length > 0 && orphanage.images.map((image, index) => (
                <button 
                  className={index === activeImage ? 'active' : ''} 
                  type="button" 
                  key={index}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image.url} alt={orphanage.name} />
                </button>
              ))
            }
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <MapContainer 
                center={[orphanage.latitude, orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                zoomControl={false}
                scrollWheelZoom={false}
              >
               <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}/>
                <Marker interactive={false} icon={happyMapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </MapContainer>

              <footer>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver rotas no Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              
              {orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#FF669D" />
                  Não atendemos <br />
                  fim de semana
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
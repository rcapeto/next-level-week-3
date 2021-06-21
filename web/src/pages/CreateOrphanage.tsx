import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { FiPlus } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import '../styles/pages/create-orphanage.css';
import happyMapIcon from '../utils/happyIcon';
import api from '../services/api';


export default function CreateOrphanage() {
  const [currentPosition, setCurrentPosition] = useState({ latitude: 0, longitude: 0 });
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCurrentPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        map.locate();
        setPosition({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
      
    })
  
    return position.latitude !== 0 ? (
      <Marker 
        icon={happyMapIcon}
        position={[position.latitude, position.longitude]}
      />
    ) : null;
    
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData();

    if(
      name === '' || 
      about === '' || 
      position.latitude === 0 || 
      position.longitude === 0 ||
      instructions === '' ||
      opening_hours === '' ||
      images.length === 0
    ) {
      return window.alert('Por favor preencha todos os campos!');
    }

    formData.append('name', name);
    formData.append('about', about);
    formData.append('latitude', String(position.latitude));
    formData.append('longitude', String(position.longitude));
    formData.append('instructions', instructions);
    formData.append('opening_hours', opening_hours);
    formData.append('open_on_weekends', String(open_on_weekends));
    images.forEach(image => {
      formData.append('images', image);
    });

    await api.post('orphanages', formData);

    window.alert('Cadastro realizado com sucesso!');

    history.push('/app');
  }

  function handleSelectImages(e: ChangeEvent<HTMLInputElement>) {
    if(!e.target.files) {
      return;
    } 

    const imagesFiles = Array.from(e.target.files);
    setImages(imagesFiles);
    const imagesFilesPreview = imagesFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(imagesFilesPreview);
    
  }

  function handleDeleteImage(currentImage: any, index: any) {
    setPreviewImages(previewImages.filter(image => image !== currentImage));
    const attImages = [];

    for(let i = 0; i < images.length; i++) {
      if(i !== index) {
        attImages.push(images[i]);
      }
    }
    setImages(attImages);
  }

   return(
      <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            {
              currentPosition.latitude !== 0 && (
                <MapContainer 
                  style={{ width: '100%', height: 280 }}
                  center={[currentPosition.latitude, currentPosition.longitude]} 
                  zoom={15}
                >
                  <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}/>
                  <LocationMarker />
                </MapContainer>
              )
            }

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={e => setName(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={e => setAbout(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {
                  previewImages.map((image, index) => (
                    <div className="image-preview" key={index}>
                      <img src={image} alt={image} />
                      <button onClick={() => handleDeleteImage(image, index)}>
                        <IoMdClose size={20} color="#FF669D"/>
                      </button>
                    </div>
                  ))
                }
                <label className="new-image" htmlFor="image[]">
                  <FiPlus size={24} color="#15b6d6" />
                </label>

              </div>              
              <input type="file" id="image[]" multiple onChange={handleSelectImages}/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={e => setInstructions(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={e => setOpeningHours(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button"
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                  >
                    Sim 
                </button>
                <button 
                  type="button"
                  className={open_on_weekends ? '' : 'active'}
                  onClick={() => setOpenOnWeekends(false)}
                  >
                    Não 
                </button>
              </div>
            </div>
          </fieldset>

          <button type="submit" className="primary-button">Confirmar</button>
        </form>
      </main>
    </div>
   );
}
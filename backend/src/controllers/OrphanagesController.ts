import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import OrphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {
   async create(request: Request, response: Response) {
      const { 
         name, 
        latitude, 
        longitude, 
        about, 
        instructions, 
        opening_hours, 
        open_on_weekends
      } = request.body;
  
      const orphanageRepository = getRepository(Orphanage);

      const requestImages = request.files as Express.Multer.File[];
      const images = requestImages.map(image => {
         return { path: image.filename }
      })

      const data = {
         name, 
         latitude, 
         longitude, 
         about, 
         instructions, 
         opening_hours, 
         open_on_weekends: open_on_weekends === 'true',
         images,
      }
   
      const orphanage = orphanageRepository.create(data);

      const schema = Yup.object().shape({
         name: Yup.string().required(),
         latitude: Yup.number().required(),
         longitude: Yup.number().required(),
         about: Yup.string().required().max(300),
         instructions: Yup.string().required(),
         opening_hours: Yup.string().required(),
         open_on_weekends: Yup.boolean().required(),
         images: Yup.array(Yup.object().shape({
            path: Yup.string().required(),
         }))
      });

      await schema.validate(data, {
         abortEarly: false,
      })
   
      await orphanageRepository.save(orphanage);
   
      return response.status(201).json(orphanage);
   },

   async index(request: Request, response: Response) {
      const orphanageRepository = getRepository(Orphanage);

      const orphanages = await orphanageRepository.find({
         relations: ['images']
      });

      return response.status(200).json(OrphanageView.renderMany(orphanages));
   },

   async show(request: Request, response: Response) {
      const { id } = request.params;

      const orphanageRepository = getRepository(Orphanage);

      const orphanage = await orphanageRepository.findOneOrFail(id, {
         relations: ['images']
      });

      return response.status(200).json(OrphanageView.render(orphanage));
   }
}
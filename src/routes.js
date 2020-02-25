import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryManController from './app/controllers/DeliveryManController';
import SignatureController from './app/controllers/SignatureController';
import OrderController from './app/controllers/OrderController';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliveredController from './app/controllers/DeliveredController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get(
  '/deliveryman/:deliveryManId/deliveries',
  DeliveriesController.index
);

routes.get('/deliveryman/:deliveryManId/delivered', DeliveredController.index);

routes.put('/deliveryman/:deliveryManId/delivery', DeliveryController.update);
routes.post(
  '/deliveryman/:deliveryManId/finish',
  upload.single('file'),
  DeliveryController.create
);

routes.post('/delivery/:orderId/problems', DeliveryProblemController.create);
routes.get('/delivery/:orderId/problems', DeliveryProblemController.index);
routes.delete('/problem/:problemId/problems', DeliveryProblemController.delete);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliveryman', DeliveryManController.store);
routes.put('/deliveryman/:deliveryManId', DeliveryManController.update);
routes.get('/deliveryman', DeliveryManController.index);
routes.get('/deliveryman/:deliveryManId', DeliveryManController.show);
routes.delete('/deliveryman/:deliveryManId', DeliveryManController.delete);

routes.post('/orders', OrderController.store);
routes.put('/orders/:orderId', OrderController.update);
routes.get('/orders', OrderController.index);
routes.get('/orders/:orderId', OrderController.show);
routes.delete('/orders/:orderId', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);
routes.post('/signatures', upload.single('file'), SignatureController.store);

export default routes;

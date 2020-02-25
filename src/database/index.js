import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import DeliveryMan from '../app/models/DeliveryMan';
import Signature from '../app/models/Signature';
import Order from '../app/models/Order';
import DeliveryProblem from '../app/models/DeliveryProblem';

import databaseConfig from '../config/database';

const models = [
  User,
  Recipient,
  File,
  DeliveryMan,
  Signature,
  Order,
  DeliveryProblem,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();

import Sequelize, { Model } from 'sequelize';

class DeliveryMan extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'deliveryman',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'file' });
  }
}

export default DeliveryMan;

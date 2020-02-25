import { Op } from 'sequelize';

import DeliveryMan from '../models/DeliveryMan';
import Order from '../models/Order';

class DeliveredController {
  async index(req, res) {
    const { deliveryManId } = req.params;

    if (!(await DeliveryMan.findByPk(deliveryManId))) {
      return res.status(400).json({ error: 'Delivery Man does not exists' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: deliveryManId,
        end_date: {
          [Op.not]: null,
        },
      },

      order: ['id'],
    });

    return res.json(orders);
  }
}

export default new DeliveredController();

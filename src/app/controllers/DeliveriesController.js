import DeliveryMan from '../models/DeliveryMan';
import Order from '../models/Order';

class DeliveriesController {
  async index(req, res) {
    const { deliveryManId } = req.params;

    if (!(await DeliveryMan.findByPk(deliveryManId))) {
      return res.status(400).json({ error: 'Delivery Man does not exists' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: deliveryManId,
        canceled_at: null,
        start_date: null,
      },
      order: ['id'],
    });

    return res.json(orders);
  }
}

export default new DeliveriesController();

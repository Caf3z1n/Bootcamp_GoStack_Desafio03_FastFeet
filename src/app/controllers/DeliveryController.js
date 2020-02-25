import { parseISO, getHours, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import DeliveryMan from '../models/DeliveryMan';
import Order from '../models/Order';
import Signature from '../models/Signature';

class DeliveryController {
  async update(req, res) {
    const { deliveryManId } = req.params;
    const { date } = req.body;

    if (!(await DeliveryMan.findByPk(deliveryManId))) {
      return res.status(400).json({ error: 'Delivery Man does not exists' });
    }

    const order = await Order.findByPk(req.body.order_id);

    if (!order) {
      return res.status(400).json({ error: 'Order dos not exists' });
    }

    const hours = getHours(parseISO(date));

    if (order.deliveryman_id !== Number(deliveryManId)) {
      return res
        .status(400)
        .json({ error: 'This order is not for that delivery man' });
    }

    if (!(hours >= 8 && hours < 18)) {
      return res
        .status(400)
        .json({ error: 'Start delivery just in bussines hour' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: deliveryManId,
        start_date: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
        },
      },
    });

    if (orders.length >= 5) {
      return res.status(400).json({
        error: 'You can not delivery more then 5 orders in a day',
      });
    }

    order.update({
      start_date: parseISO(date),
    });

    return res.json(order);
  }

  async create(req, res) {
    const { deliveryManId } = req.params;
    const { originalname: name, filename: path } = req.file;
    const { orderId, date } = req.query;

    if (!(await DeliveryMan.findByPk(deliveryManId))) {
      return res.status(400).json({ error: 'Delivery man dos not exists' });
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    if (order.deliveryman_id !== Number(deliveryManId)) {
      return res
        .status(400)
        .json({ error: 'This order is not for that delivery man' });
    }

    const signature = await Signature.create({
      name,
      path,
    });

    await order.update({
      signature_id: signature.id,
      end_date: parseISO(date),
    });

    return res.json(order);
  }
}

export default new DeliveryController();

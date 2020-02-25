import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import Order from '../models/Order';
import Signature from '../models/Signature';

import OrderMail from '../jobs/OrderMail';
import Queue from '../../lib/Queue';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    /**
     * Check if recipient_id is a Recipient
     */
    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    /**
     * Check if deliveryman_id is a Delivery man
     */
    const deliveryMan = await DeliveryMan.findByPk(deliveryman_id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Delivery man does not exists' });
    }

    const order = await Order.create(req.body);

    await Queue.add(OrderMail.key, {
      deliveryMan,
      recipient,
      product: req.body.product,
    });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if OrderId is a Order
     */
    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    /**
     * Check if recipient_id is a Recipient
     */

    if (recipient_id && !(await Recipient.findByPk(recipient_id))) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    /**
     * Check if deliveryman_id is a Delivery man
     */

    if (deliveryman_id && !(await DeliveryMan.findByPk(deliveryman_id))) {
      return res.status(400).json({ error: 'Delivery man does not exists' });
    }

    await order.update(req.body);

    return res.json(order);
  }

  async index(req, res) {
    const orders = await Order.findAll({
      order: ['id'],
      attributes: [
        'id',
        'deliveryman_id',
        'signature_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: Signature,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(orders);
  }

  async show(req, res) {
    const order = await Order.findByPk(req.params.orderId, {
      attributes: [
        'id',
        'deliveryman_id',
        'signature_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: Signature,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    return res.json(order);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    order.canceled_at = new Date();

    await order.save();

    return res.json(order);
  }
}

export default new OrderController();

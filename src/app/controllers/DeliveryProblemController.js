import * as Yup from 'yup';
import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async create(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: orderId,
      description,
    });

    return res.json(deliveryProblem);
  }

  async index(req, res) {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: orderId,
      },
    });

    return res.json(deliveryProblems);
  }

  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.problemId);

    if (!problem) {
      return res
        .status(400)
        .json({ error: 'Delivery problem does not exists' });
    }

    const order = await Order.findByPk(problem.delivery_id);

    if (order.canceled_at) {
      return res.status(400).json({ error: 'Delivery is already cancelled' });
    }

    /* await order.update({
      canceled_at: Date(),
    }); */

    const deliveryMan = await DeliveryMan.findByPk(order.deliveryman_id);
    const recipient = await Recipient.findByPk(order.recipient_id);

    await Queue.add(CancellationMail.key, {
      deliveryMan,
      description: problem.description,
      product: order.product,
      recipient: recipient.nome,
    });

    return res.json(order);
  }
}

export default new DeliveryProblemController();

import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar_id: Yup.number(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryManExists = await DeliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (deliveryManExists) {
      return res.status(401).json({ error: 'DeliveryMan already exists' });
    }

    const deliveryMan = await DeliveryMan.create(req.body);

    return res.json(deliveryMan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      avatar_id: Yup.number(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryMan = await DeliveryMan.findByPk(req.params.deliveryManId);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'DeliveryMan does not exists' });
    }

    const { email } = req.body;

    if (email && email !== deliveryMan.email) {
      const deliveryManExists = await DeliveryMan.findOne({ where: { email } });

      if (deliveryManExists) {
        return res.status(400).json({ error: 'DeliveryMan already exists' });
      }
    }

    if (req.body.avatar_id && !(await File.findByPk(req.body.avatar_id))) {
      return res.status(400).json({ error: 'Avatar_id does not exists' });
    }

    await deliveryMan.update(req.body);

    return res.json(deliveryMan);
  }

  async index(req, res) {
    const couries = await DeliveryMan.findAll({
      order: ['id'],
      attributes: ['id', 'name', 'avatar_id', 'email'],
      include: [
        {
          model: File,
          as: 'file',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(couries);
  }

  async show(req, res) {
    const deliveryMan = await DeliveryMan.findByPk(req.params.deliveryManId);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'DeliveryMan does not exists' });
    }

    return res.json(deliveryMan);
  }

  async delete(req, res) {
    const deliveryMan = await DeliveryMan.findByPk(req.params.deliveryManId);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'DeliveryMan does not exists' });
    }

    await deliveryMan.destroy();

    return res.json(deliveryMan);
  }
}

export default new DeliveryManController();

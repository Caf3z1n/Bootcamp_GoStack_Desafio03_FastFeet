import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string()
        .length(8)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json({ recipient });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      rua: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string(),
      estado: Yup.string(),
      cidade: Yup.string(),
      cep: Yup.string().length(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exists' });
    }

    await recipient.update(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();

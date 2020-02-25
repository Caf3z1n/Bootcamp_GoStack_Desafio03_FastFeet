import Mail from '../../lib/Mail';

class OrderMail {
  get key() {
    return 'OrderMail';
  }

  async handle({ data }) {
    const { deliveryMan, recipient, product } = data;

    await Mail.sendMail({
      to: `${deliveryMan.name} <${deliveryMan.email}>`,
      subject: 'Nova entrega',
      template: 'order',
      context: {
        deliveryman: deliveryMan.name,
        produto: product,
        recipient: recipient.nome,
        rua: recipient.rua,
        numero: recipient.numero,
        estado: recipient.estado,
        cidade: recipient.cidade,
        cep: recipient.cep,
      },
    });
  }
}

export default new OrderMail();

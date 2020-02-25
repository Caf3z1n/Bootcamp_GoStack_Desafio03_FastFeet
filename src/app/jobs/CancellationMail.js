import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliveryMan, description, product, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryMan.name} <${deliveryMan.email}>`,
      subject: 'Novo Cancelamento',
      template: 'cancellation',
      context: {
        deliveryman: deliveryMan.name,
        description,
        product,
        recipient,
      },
    });
  }
}

export default new CancellationMail();

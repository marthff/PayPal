const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');

const app = express();
app.use(express.static('front'));
app.use(express.urlencoded({ extended: true }));

const clientId = 'YOUR_PAYPAL_CLIENT_ID';
const clientSecret = 'YOUR_PAYPAL_CLIENT_SECRET';
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

app.post('/create-order', async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  // Extrair outras informações do comprador...

  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{ 
        amount: {
          currency_code: 'USD',
          value: '19.99' 
        },
        shipping: {
          name: {
            full_name: `${firstName} ${lastName}`
          }
         
        }
      }]
    });

    const order = await client.execute(request);
    res.status(200).json({ orderId: order.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar pedido com PayPal');
  }
});

app.post('/capture-order', async (req, res) => {
  const orderId = req.body.orderId;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client.execute(request);
    res.status(200).json({ captureId: capture.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao capturar pagamento com PayPal');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

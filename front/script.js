async function event(e){
  e.preventDefault();
  e.stopPropagation();
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  // Extrair outras informações do comprador...

  try {
    const response = await fetch('/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        // Enviar outras informações do comprador...
      })
    });

    const data = await response.json();
    const orderId = data.orderId;

    // Redirecionar para página de agradecimento ou mostrar mensagem ao usuário
    // com o ID do pedido (orderId)
  } catch (error) {
    console.error(error);
    // Tratar erros
  }
}
  
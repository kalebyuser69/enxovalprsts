// Aplicar máscara ao campo de telefone
const telefoneInput = document.getElementById('telefone');
const im = new Inputmask('(99) 9 9999-9999');
im.mask(telefoneInput);

// Evento de envio do formulário
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const telefone = telefoneInput.value;
  const senhaInput = document.getElementById('senha');
  const senha = senhaInput.value;
  const nome = document.getElementById('nome').value;
  const statusElement = document.getElementById('status');

  // Validação do formato do telefone
  const telefonePattern = /^\(\d{2}\) 9 \d{4}-\d{4}$/;
  if (!telefonePattern.test(telefone)) {
    statusElement.textContent = 'Por favor, insira um número de telefone válido no formato: (XX) 9 XXXX-XXXX';
    statusElement.classList.add('erro');
    statusElement.classList.remove('sucesso', 'aviso');  // Limpar outras classes
    return; // Impede o envio do formulário se o telefone não for válido
  }

  try {
    const response = await fetch('https://enxovalprsts.vercel.app/login.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefone, senha, nome })
    });

    const data = await response.json();

    // Remover classes antigas antes de adicionar a nova
    statusElement.classList.remove('sucesso', 'aviso', 'erro');

    if (response.ok) {
      if (data.novoUsuario) {
        statusElement.textContent = `Senha gerada: ${data.senhaGerada}. Use-a para entrar.`;
        statusElement.classList.add('sucesso'); // Verde para sucesso
        senhaInput.style.display = 'block';
        senhaInput.focus();
      } else if (data.senhaRequerida) {
        statusElement.textContent = 'Usuário encontrado. Insira sua senha.';
        statusElement.classList.add('aviso'); // Amarelo para aviso
        senhaInput.style.display = 'block';
        senhaInput.focus();
      } else if (data.autenticado) {
        statusElement.textContent = 'Login bem-sucedido! Abrindo Lista de Presentes...';
        statusElement.classList.add('sucesso'); // Verde para sucesso
        // Salvar ID do usuário e telefone no localStorage
        localStorage.setItem('usuarioId', data.usuarioId);
        localStorage.setItem('usuarioTelefone', telefone); // Salvar o telefone também
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
      } else {
        statusElement.textContent = data.message;
        statusElement.classList.add('erro'); // Vermelho para erro
      }
    } else {
      statusElement.textContent = data.message;
      statusElement.classList.add('erro'); // Vermelho para erro
    }
  } catch (error) {
    console.error('Erro:', error);
    statusElement.textContent = 'Erro ao tentar fazer login.';
    statusElement.classList.add('erro');
    statusElement.classList.remove('sucesso', 'aviso'); // Limpar outras classes
  }
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { nanoid } = require('nanoid');
const path = require('path');


const app = express();
const port = 5000;

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Definir uma rota padrão para servir a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(cors());
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/meuapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Definir o esquema do usuário
const UsuarioSchema = new mongoose.Schema({
  telefone: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  nome: { type: String, required: true }
});

// Criar o modelo do usuário
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Definir o esquema do carrinho
const CarrinhoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  produtos: [
    {
      nome: String,
      preco: String,
      quantidade: { type: Number, required: true },
      link: String,
      imagem: String
    }
  ]
});

// Criar o modelo do carrinho
const Carrinho = mongoose.model('Carrinho', CarrinhoSchema);

// Rota para login ou cadastro
app.post('/api/login', async (req, res) => {
  const { telefone, senha, nome } = req.body;

  try {
    if (!telefone || telefone.length < 10) {
      return res.status(400).json({ message: 'Número de telefone inválido.' });
    }
    if (!nome || nome.trim().length < 3) {
      return res.status(400).json({ message: 'Nome inválido. Digite pelo menos 3 caracteres.' });
    }

    let usuario = await Usuario.findOne({ telefone });

    if (!usuario) {
      const novaSenha = nanoid(4);
      usuario = new Usuario({ telefone, senha: novaSenha, nome });
      await usuario.save();

      return res.status(201).json({
        message: 'Novo usuário criado. Digite essa senha para entrar.',
        senhaGerada: novaSenha,
        novoUsuario: true,
        telefone // Retorna o telefone também
      });
    }

    if (!senha) {
      return res.status(200).json({
        message: 'Usuário encontrado. Insira a senha.',
        senhaRequerida: true,
        telefone // Retorna o telefone também
      });
    }

    if (senha === usuario.senha) {
      return res.status(200).json({
        message: 'Login bem-sucedido!',
        autenticado: true,
        telefone // Retorna o telefone também
      });
    } else {
      return res.status(401).json({ message: 'Senha incorreta. Tente novamente.' });
    }
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro ao processar a solicitação.', error: err.message });
  }
});


// Rota para adicionar produto ao carrinho
app.post('/api/carrinho/adicionar', async (req, res) => {
  const { usuarioId, produto } = req.body;

  try {
    let carrinho = await Carrinho.findOne({ usuarioId });

    if (!carrinho) {
      // Se o carrinho não existir, cria um novo
      carrinho = new Carrinho({
        usuarioId,
        produtos: [produto]
      });
    } else {
      // Se o carrinho já existir, adiciona o produto
      const produtoExistente = carrinho.produtos.find(p => p.nome === produto.nome);

      if (produtoExistente) {
        // Se o produto já estiver no carrinho, apenas atualiza a quantidade
        produtoExistente.quantidade += produto.quantidade;
      } else {
        carrinho.produtos.push(produto);
      }
    }

    await carrinho.save();
    res.status(200).json({ message: 'Produto adicionado ao carrinho!', carrinho });
  } catch (err) {
    console.error('Erro ao adicionar ao carrinho:', err);
    res.status(500).json({ message: 'Erro ao adicionar produto ao carrinho.', error: err.message });
  }
});

// Rota para visualizar o carrinho
app.get('/api/carrinho/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const carrinho = await Carrinho.findOne({ usuarioId });

    if (!carrinho) {
      return res.status(404).json({ message: 'Carrinho vazio ou não encontrado.' });
    }

    res.status(200).json({ carrinho });
  } catch (err) {
    console.error('Erro ao visualizar o carrinho:', err);
    res.status(500).json({ message: 'Erro ao recuperar o carrinho.', error: err.message });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});

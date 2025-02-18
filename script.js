// Espera o carregamento completo da página
window.addEventListener("load", function () {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "none"; // Esconde a tela de carregamento
});

document.addEventListener("DOMContentLoaded", function () {
    const listaProdutos = document.getElementById("lista-produtos");

    // Exemplo de categorias e produtos
    const categorias = {
        "Roupas": [
            {
                nome: "Body",
                preco: "R$ 34,90",
                link: "https://shopee.com.br/Toalha-de-banho-infantil-felpuda-com-capuz-de-bichinho-i.417646323.21499371560?sp_atk=c288f75b-9ee6-41f4-9e9f-d11fb34bde6b&xptdk=c288f75b-9ee6-41f4-9e9f-d11fb34bde6b",
                imagem: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzp2xhfvdhz54e.webp",
                quantidade: 2
            },
            {
                nome: "Camiseta",
                preco: "R$ 29,90",
                link: "https://example.com/camiseta",
                imagem: "https://via.placeholder.com/800x400?text=Camiseta",
                quantidade: 5
            },
            {
                nome: "Jaqueta",
                preco: "R$ 120,00",
                link: "https://example.com/jaqueta",
                imagem: "https://via.placeholder.com/800x400?text=Jaqueta",
                quantidade: 3
            }
        ],
        "Calçados": [
            {
                nome: "Tênis",
                preco: "R$ 89,90",
                link: "https://example.com/tenis",
                imagem: "https://via.placeholder.com/800x400?text=Tênis",
                quantidade: 10
            },
            {
                nome: "Sapato",
                preco: "R$ 99,90",
                link: "https://example.com/sapato",
                imagem: "https://via.placeholder.com/800x400?text=Sapato",
                quantidade: 5
            }
        ],
        "Acessorios": [
            {
                nome: "Relógio",
                preco: "R$ 89,90",
                link: "https://example.com/relogio",
                imagem: "https://via.placeholder.com/800x400?text=Relógio",
                quantidade: 5
            },
            {
                nome: "Pulseira",
                preco: "R$ 99,90",
                link: "https://example.com/pulseira",
                imagem: "https://via.placeholder.com/800x400?text=Pulseira",
                quantidade: 5
            }
        ]
    };

    Object.entries(categorias).forEach(([categoria, produtos], categoriaIndex) => {
        if (Array.isArray(produtos)) {
            const categoriaCol = document.createElement("div");
            categoriaCol.classList.add("col-md-12", "categoria-container");

            const categoriaTitulo = document.createElement("h2");
            categoriaTitulo.textContent = categoria.toUpperCase();
            categoriaCol.appendChild(categoriaTitulo);

            const carrossel = document.createElement("div");
            carrossel.classList.add("carousel", "slide");
            carrossel.id = `carousel-${categoriaIndex}`;

            const carrosselInner = document.createElement("div");
            carrosselInner.classList.add("carousel-inner");

            produtos.forEach((produto, index) => {
                const item = document.createElement("div");
                item.classList.add("carousel-item");
                if (index === 0) {
                    item.classList.add("active");
                }

                // Configurando o produto
                const produtoDiv = document.createElement("div");
                produtoDiv.classList.add("produto");

                const nomePreco = document.createElement("p");
                nomePreco.innerHTML = `<strong>${produto.nome}</strong> — ${produto.preco}`;
                produtoDiv.appendChild(nomePreco);

                const img = document.createElement("img");
                img.src = produto.imagem;
                img.alt = produto.nome;
                produtoDiv.appendChild(img);

                const link = document.createElement("a");
                link.href = produto.link;
                link.textContent = "Comprar no site";
                link.target = "_blank";
                link.classList.add("btn", "btn-primary");
                produtoDiv.appendChild(link);

                // Quantidade do produto
                const quantidadeProduto = document.createElement("p");
                quantidadeProduto.textContent = `Faltam: ${produto.quantidade}`;
                produtoDiv.appendChild(quantidadeProduto);

                // Recuperar a quantidade do localStorage ao carregar a página
                const storedQuantity = localStorage.getItem(produto.nome);
                if (storedQuantity) {
                    produto.quantidade = parseInt(storedQuantity, 10); // Corrigido para base 10
                    quantidadeProduto.textContent = `Faltam: ${produto.quantidade}`;
                }

                // Criar um elemento para exibir a quantidade comprada
                const quantidadeComprada = document.createElement("p");
                quantidadeComprada.textContent = `Comprados: 0`; // Inicializa com 0
                produtoDiv.appendChild(quantidadeComprada); // Adiciona a quantidade comprada

                // Checkbox para marcar como "Escolhido"
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("checkbox");
                checkbox.id = `checkbox-${produto.nome}`; // Adiciona um ID único para cada checkbox
                checkbox.setAttribute("data-product", produto.nome);  // Aqui é onde associamos o nome do produto à checkbox
                produtoDiv.appendChild(checkbox);
                

                // Adicionando um label para a checkbox
                const label = document.createElement("label");
                label.setAttribute("for", checkbox.id);
                produtoDiv.appendChild(label);

                // Recuperar a quantidade comprada do localStorage ao carregar a página
                const storedComprados = localStorage.getItem(`${produto.nome}-comprados`);
                if (storedComprados) {
                    const comprados = parseInt(storedComprados, 10); // Converte para número
                    quantidadeComprada.textContent = `Comprados: ${comprados}`; // Atualiza o texto exibido
                }

                // Verifica se a checkbox deve estar marcada ao carregar a página
                if (produto.quantidade === 0) { // Se a quantidade for 0
                    checkbox.checked = true; // Marca a checkbox
                    checkbox.disabled = true; // Desabilita a checkbox
                    link.style.pointerEvents = "none"; // Desabilita o link
                    link.style.backgroundColor = "red"; // Muda a cor do botão para indicar que está desabilitado
                    produtoDiv.style.backgroundColor = "#d65c5c"; // Muda a cor da caixa do produto para vermelho
                }
                // Função para atualizar o estado da checkbox com base na quantidade
                function atualizarCheckbox(checkbox, quantidade) {
                    if (quantidade === 0) {
                        checkbox.disabled = true; // Desativa a checkbox
                        checkbox.checked = checkbox.checked || false; //Garante que ela não esteja marcada
                        checkbox.classList.add("produto-esgotado"); // Adiciona classe para estilização
                    } else {
                        checkbox.disabled = false; // Reativa a checkbox
                        checkbox.checked = false; // Garante que a checkbox não permaneça marcada
                        checkbox.classList.remove("produto-esgotado"); // Remove a classe caso tenha estoque
                    }
                }

                // Evento do botão de reset
                document.getElementById("reset-button").addEventListener("click", function () {
                    // Limpa o localStorage
                    localStorage.clear();

                    // Atualiza a interface do usuário para refletir as quantidades resetadas
                    const checkboxes = document.querySelectorAll('.checkbox');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = false; // Desmarca todas as checkboxes
                        checkbox.disabled = false; // Habilita todas as checkboxes
                    });

                    // Observa mudanças na quantidade dos produtos
                    document.querySelectorAll(".produto").forEach(produto => {
                        const quantidadeSpan = produto.querySelector(".quantidade"); // Supõe que a quantidade está em um elemento com classe "quantidade"
                        const checkbox = produto.querySelector("input[type='checkbox']");

                        if (quantidadeSpan && checkbox) {
                            // Atualiza o estado da checkbox com base na quantidade
                            const novaQuantidade = parseInt(quantidadeSpan.textContent.split(": ")[1], 10); // Extrai a quantidade de "Faltam: X"
                            atualizarCheckbox(checkbox, novaQuantidade);
                        }
                    });
                });

// Evento para checkbox
checkbox.addEventListener("change", function () {
    const message = document.getElementById("message");
    const telefone = localStorage.getItem("usuarioTelefone");

    if (!telefone) {
        alert("Usuário não autenticado. Faça login para adicionar itens ao carrinho.");
        window.location.href = "login.html"; // Redireciona o usuário para a página de login
        this.checked = false;
        return;
    }

    const productName = this.getAttribute("data-product");

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let produtoExistente = carrinho.find(item => item.nome === productName);

    if (this.checked) {
        // Adiciona o produto ao carrinho ou incrementa a quantidade
        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            carrinho.push({ nome: productName, quantidade: 1 });
        }
    }

    // Salva a atualização no localStorage
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    console.log("Carrinho atualizado:", JSON.parse(localStorage.getItem("carrinho"))); // Debug no console

    if (!message) {
        console.error("Erro: O elemento 'message' não foi encontrado no DOM.");
        return;
    }

    // Caso a checkbox esteja marcada (usuário marca manualmente)
    if (this.checked) {
        // Verifica se ainda há quantidade disponível
        if (produto.quantidade > 0) {
            // Reduz a quantidade
            produto.quantidade--;
            quantidadeProduto.textContent = `Faltam: ${produto.quantidade}`;
            localStorage.setItem(produto.nome, produto.quantidade); // Salva a nova quantidade no localStorage

            // Atualiza a quantidade comprada
            let comprados = parseInt(localStorage.getItem(`${produto.nome}-comprados`)) || 0;
            comprados++;
            quantidadeComprada.textContent = `Comprados: ${comprados}`;
            localStorage.setItem(`${produto.nome}-comprados`, comprados); // Salva no localStorage

            // Verifica se a quantidade chegou a 0
            if (produto.quantidade === 0) {
                this.disabled = true; // Desativa a checkbox
                link.style.pointerEvents = "none"; // Desabilita o link
                link.style.backgroundColor = "red"; // Muda a cor do botão para indicar desativado
                produtoDiv.style.backgroundColor = "#d65c5c"; // Muda a cor da caixa do produto para vermelho
                produtoDiv.innerHTML = "<strong>Escolhido</strong>"; // Substitui qualquer conteúdo existente e coloca o texto em negrito
            }

            // Atualiza a checkbox imediatamente
            atualizarCheckbox(this, produto.quantidade);

            // Atualiza a mensagem de confirmação
            message.style.cssText = `
                display: block !important;
                font-size: 33px; 
                position: fixed; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%, -50%); 
                background-color: #1ab822;
                color: white; 
                padding: 25px; 
                border-radius: 5px; 
                z-index: 1000;
            `;
            message.innerHTML = `A caixa de seleção foi marcada e 1 item foi adicionado aos "Comprados"!!!`;

            setTimeout(() => {
                message.style.display = "none";
            }, 4000);


                        } else {
                            // Se quantidade for 0, mantém a checkbox marcada e desativada
                            this.checked = true; // Garante que fique marcada
                            this.disabled = true; // Desabilita a checkbox

                            // Desabilita link e altera estilo
                            link.style.pointerEvents = "none";
                            link.style.backgroundColor = "red";
                            produtoDiv.style.backgroundColor = "#d65c5c";


                            console.log("Estoque esgotado. Checkbox desativada.");
                            // Dispara o evento "quantidadeAtualizada" para atualizar a interface
                            const quantidadeAtualizadaEvent = new CustomEvent("quantidadeAtualizada", {
                                detail: { quantidade: produto.quantidade },
                            });
                            produtoDiv.dispatchEvent(quantidadeAtualizadaEvent); // Dispara o evento para atualizar a checkbox
                            // Atualiza a checkbox imediatamente
                            atualizarCheckbox(this, produto.quantidade);

                        }
                    

                    }
                });


                item.appendChild(produtoDiv);
                carrosselInner.appendChild(item);
            })

            carrossel.appendChild(carrosselInner);

            // Controles do carrossel
            const prev = document.createElement("button");
            prev.classList.add("carousel-control-prev");
            prev.innerHTML = `<span class="carousel-control-prev-icon"></span>`;
            prev.setAttribute("data-bs-target", `#carousel-${categoriaIndex}`);
            prev.setAttribute("data-bs-slide", "prev");

            const next = document.createElement("button");
            next.classList.add("carousel-control-next");
            next.innerHTML = `<span class="carousel-control-next-icon"></span>`;
            next.setAttribute("data-bs-target", `#carousel-${categoriaIndex}`);
            next.setAttribute("data-bs-slide", "next");

            carrossel.appendChild(prev);
            carrossel.appendChild(next);

            categoriaCol.appendChild(carrossel);
            listaProdutos.appendChild(categoriaCol);
        }
    });
});

document.getElementById("reset-button").addEventListener("click", function () {
    // Limpa o localStorage
    localStorage.clear();

    // Opcional: Atualiza a interface do usuário para refletir as quantidades resetadas
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Desmarca todas as checkboxes
        checkbox.disabled = false; // Habilita todas as checkboxes
        //*********************BOTÃO ATIVAR************** */
    });
});

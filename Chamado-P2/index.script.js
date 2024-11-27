
// Função para gerar um ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Funções de manipulação do localStorage
function saveChamados(chamados) {
    localStorage.setItem('chamados', JSON.stringify(chamados));
}

// function loadChamados() {
//     const chamados = localStorage.getItem('chamados');
//     return chamados ? JSON.parse(chamados) : [];
// }
async function loadChamados(categoria = 'todos') {
    try {
        const endpoint = categoria === 'todos'
        ? 'http://localhost:4000/api/chamados'
        : `http://localhost:4000/api/chamados/categoria/${categoria}`;

        const response = await fetch(endpoint);
        const chamados = await response.json();
        return chamados;
    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        return [];
    }
}

// Função para criar um novo chamado
async function criarChamado(evento) {
    evento.preventDefault();

    const categoria = document.getElementById('categoria').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    // const usuario = document.getElementById('usuario').value;

    const chamado = {
        categoria,
        titulo,
        descricao,
        status: 'aberto',
        // usuario,
    };

    try {
        const response = await fetch('http://localhost:4000/api/chamados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chamado),
        });

        if (response.ok) {
            alert('Chamado criado com sucesso!');
            window.location.href = 'lista_chamados.html';
        } else {
            const error = await response.json();
            alert(`Erro ao criar chamado: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        alert('Erro ao criar chamado.');
    }
}
// function criarChamado(evento) {
//     evento.preventDefault();

//     const categoria = document.getElementById('categoria').value;
//     const titulo = document.getElementById('titulo').value;
//     const descricao = document.getElementById('descricao').value;

//     const chamado = {
//         id: generateId(),
//         categoria,
//         titulo,
//         descricao,
//         status: 'aberto',
//         dataCriacao: new Date().toISOString(),
//         dataAtualizacao: new Date().toISOString()
//     };

//     const chamados = loadChamados();
//     chamados.push(chamado);
//     saveChamados(chamados);

//     // Limpar o formulário e redirecionar
//     evento.target.reset();
//     alert('Chamado criado com sucesso!');
//     window.location.href = 'lista_chamados.html';
// }

// Função para exibir a lista de chamados
async function exibirChamados(categoria = 'todos') {
    const listaChamados = document.getElementById('lista-chamados');
    if (!listaChamados) return;

    const chamados = await loadChamados(categoria);

    listaChamados.innerHTML = ''; // Limpa a lista

    if (chamados.length === 0) {
        listaChamados.innerHTML = `<p>Nenhum chamado encontrado para a categoria: ${categoria}</p>`;
        return;
    }

    chamados.forEach(chamado => {
        const chamadoElement = criarElementoChamado(chamado);
        listaChamados.appendChild(chamadoElement);
    });
}
// function exibirChamados() {
//     const listaChamados = document.getElementById('lista-chamados');
//     if (!listaChamados) return;

//     const chamados = loadChamados();
//     listaChamados.innerHTML = '';

//     // Organizar chamados por categoria
//     const chamadosPorCategoria = {
//         'TI': [],
//         'Manutenção': [],
//         'RH': []
//     };

//     chamados.forEach(chamado => {
//         chamadosPorCategoria[chamado.categoria].push(chamado);
//     });

//     // Criar seções para cada categoria
//     for (const categoria in chamadosPorCategoria) {
//         const secaoCategoria = document.createElement('div');
//         secaoCategoria.className = 'categoria-section';
//         secaoCategoria.innerHTML = `<h3 class="categoria-title">${categoria}</h3>`;

//         const chamadosCategoria = chamadosPorCategoria[categoria];
//         if (chamadosCategoria.length === 0) {
//             secaoCategoria.innerHTML += '<p class="no-tickets">Nenhum chamado nesta categoria</p>';
//         } else {
//             chamadosCategoria.forEach(chamado => {
//                 const chamadoElement = criarElementoChamado(chamado);
//                 secaoCategoria.appendChild(chamadoElement);
//             });
//         }

//         listaChamados.appendChild(secaoCategoria);
//     }
// }

// Função auxiliar para criar elemento de chamado
function criarElementoChamado(chamado) {
    const chamadoElement = document.createElement('div');
    chamadoElement.className = 'chamado-item';
    
    const dataFormatada = new Date(chamado.dataCriacao).toLocaleDateString('pt-BR');
    
    chamadoElement.innerHTML = `
        <h4>${chamado.titulo}</h4>
        <span class="status-badge status-${chamado.status}">${chamado.status}</span>
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Descrição:</strong> ${chamado.descricao}</p>
        <button onclick="atualizarStatus('${chamado.id}')" class="btn-status">
            Atualizar Status
        </button>
        <button onclick="excluirChamado('${chamado.id}')" class="btn-delete">
            Excluir
        </button>
    `;
    
    return chamadoElement;
}

// Função para atualizar o status do chamado
async function atualizarStatus(chamadoId) {
    try {
        const response = await fetch(`http://localhost:4000/api/chamados/${chamadoId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('Status atualizado com sucesso!');
            exibirChamados();
        } else {
            const error = await response.json();
            alert(`Erro ao atualizar status: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
    }
}
// function atualizarStatus(chamadoId) {
//     const chamados = loadChamados();
//     const chamado = chamados.find(c => c.id === chamadoId);
    
//     if (chamado) {
//         switch (chamado.status) {
//             case 'aberto':
//                 chamado.status = 'em-andamento';
//                 break;
//             case 'em-andamento':
//                 chamado.status = 'fechado';
//                 break;
//             case 'fechado':
//                 chamado.status = 'aberto';
//                 break;
//         }
//         chamado.dataAtualizacao = new Date().toISOString();
//         saveChamados(chamados);
//         exibirChamados();
//     }
// }

async function excluirChamado(id) {
    const confirmar = confirm('Tem certeza que deseja deletar este chamado?');
    if (!confirmar) return;

    try {
        const response = await fetch(`http://localhost:4000/api/chamados/${id}`, {
            method: 'DELETE',
        });

        const resultado = await response.json();
        if (response.ok) {
            alert(resultado.message);
            fetchChamados(); // Atualiza a lista de chamados
        } else {
            alert(`Erro: ${resultado.message}`);
        }
    } catch (error) {
        console.error('Erro ao deletar chamado:', error);
        alert('Erro ao deletar chamado. Tente novamente mais tarde.');
    }
}
// function excluirChamado(chamadoId) {
//     let chamados = loadChamados();
//     chamados = chamados.filter(chamado => chamado.id !== chamadoId);
//     saveChamados(chamados);
//     exibirChamados();
//     alert('Chamado excluído com sucesso!');
// }


// function exibirChamados(categoriaSelecionada = 'todos') {
//     const listaChamados = document.getElementById('lista-chamados');
//     const chamados = loadChamados();

//     // Limpa a lista atual
//     listaChamados.innerHTML = '';

//     // Filtra os chamados pela categoria
//     const chamadosFiltrados = categoriaSelecionada === 'todos'
//         ? chamados
//         : chamados.filter(chamado => chamado.categoria === categoriaSelecionada);

//     // Exibe os chamados
//     if (chamadosFiltrados.length === 0) {
//         listaChamados.innerHTML = `<p>Nenhum chamado encontrado para a categoria: ${categoriaSelecionada}</p>`;
//         return;
//     }

//     chamadosFiltrados.forEach(chamado => {
//         const chamadoCard = document.createElement('div');
//         chamadoCard.className = 'chamado-card';
//         chamadoCard.innerHTML = `
//             <h3>${chamado.titulo}</h3>
//             <p><strong>Categoria:</strong> ${chamado.categoria}</p>
//             <p><strong>Descrição:</strong> ${chamado.descricao}</p>
//             <p><strong>Status:</strong> ${chamado.status}</p>
//             <p><strong>Criado em:</strong> ${new Date(chamado.dataCriacao).toLocaleString()}</p>
//         `;
//         listaChamados.appendChild(chamadoCard);
//     });
// }

// async function atualizarChamado(id, status, tecnico = null) {
//     const response = await fetch(`http://localhost:4000/api/chamados/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status, tecnico })
//     });

//     if (!response.ok) {
//         console.error('Erro ao atualizar chamado:', await response.text());
//     } else {
//         console.log('Chamado atualizado:', await response.json());
//     }
// };

document.addEventListener('DOMContentLoaded', () => {
    const menuCategorias = document.getElementById('menu-categorias');

    // Adiciona evento de clique nos botões de categoria
    menuCategorias.addEventListener('click', evento => {
        const categoria = evento.target.getAttribute('data-categoria');
        if (categoria) {
            exibirChamados(categoria);
        }
    });

    // Exibe todos os chamados ao carregar a página
    exibirChamados();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar formulário de criação de chamados
    const form = document.getElementById('chamado-form');
    if (form) {
        form.addEventListener('submit', criarChamado);
    }
    
    // Inicializar lista de chamados
    exibirChamados();
});

// REQUISIÇÃO DA API
async function fetchChamados(categoria = 'todos') {
    const endpoint = categoria === 'todos'
        ? 'http://localhost:4000/api/chamados'
        : `http://localhost:4000/api/chamados/categoria/${categoria}`;

    const response = await fetch(endpoint);
    const chamados = await response.json();
    exibirChamados(chamados);
}
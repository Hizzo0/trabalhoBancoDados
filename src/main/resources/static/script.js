// 1. Configurações Globais e Endpoints
const API_BASE = "http://localhost:8080/api/participantes";
const API_AUTH_URL = `${API_BASE}/login`;

let projetos = [];

const situacaoMap = {
    0: '<span style="color:red">Suspenso</span>',
    1: '<span style="color:green">Em Andamento</span>',
    2: '<span style="color:blue">Concluído</span>'
};

// 2. Inicialização do Sistema
document.addEventListener('DOMContentLoaded', () => {
    const usuarioSalvo = sessionStorage.getItem('usuarioLogado');
    
    if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        document.querySelector('.user-info strong').innerText = usuario.nome;
        
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-sistema').style.display = 'flex';
        navigateTo('dashboard');
    }
});

// 3. Sistema de Navegação (Versão Estabilizada)
function navigateTo(viewId) {
    // Esconde todas as views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active-view');
    });

    // Mostra a view selecionada
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active-view');

    // Atualiza título da página
    const titulos = {
        'dashboard': 'Dashboard',
        'projects-list': 'Meus Projetos',
        'new-project': 'Cadastrar Novo Projeto',
        'finances': 'Financiamentos',
        'productions': 'Produções'
    };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.innerText = titulos[viewId] || 'SIGPesq';

    // Gerencia destaque do menu lateral
    document.querySelectorAll('.sidebar nav li').forEach(li => li.classList.remove('active'));
    
    // Se a função foi chamada por um clique (event existe)
    if (typeof event !== 'undefined' && event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        // Se chamada via código (como no login), busca o LI correto pelo atributo onclick
        document.querySelectorAll('.sidebar nav li').forEach(item => {
            if (item.getAttribute('onclick')?.includes(viewId)) {
                item.classList.add('active');
            }
        });
    }

    // Carrega dados se for a lista
    if (viewId === 'projects-list') {
        carregarProjetosDoBanco();
    }
}

// 4. Lógica de Login
document.getElementById('formLogin').addEventListener('submit', async function(e) {
    e.preventDefault();

    const cpf = document.getElementById('login-email').value; 
    const senha = document.getElementById('login-senha').value;
    const btn = this.querySelector('button');
    
    btn.disabled = true;
    btn.innerText = 'Autenticando...';

    try {
        const response = await fetch(API_AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ cpf, senha })
        });

        if (response.ok) {
            const usuario = await response.json();
            sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            document.querySelector('.user-info strong').innerText = usuario.nome;

            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app-sistema').style.display = 'flex';
            
            // Chama a navegação sem passar o evento, evitando o erro de undefined
            navigateTo('dashboard');
        } else {
            const erroMsg = await response.text();
            alert(`Falha no Login: ${erroMsg}`);
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    } finally {
        btn.disabled = false;
        btn.innerText = 'Entrar';
    }
});

// 5. Lógica de Cadastro (Participantes)
document.getElementById('formRegister').addEventListener('submit', async function(e) {
    e.preventDefault();
    const tipo = document.getElementById('reg-tipo').value;
    
    let cpfValor = "";
    if (tipo === 'tecnico') cpfValor = document.getElementById('reg-cpf-tec').value;
    if (tipo === 'discente') cpfValor = document.getElementById('reg-cpf-dic').value;
    if (tipo === 'docente') cpfValor = document.getElementById('reg-cpf-doc').value;

    const dadosCadastro = {
        nome: document.getElementById('reg-nome').value,
        email: document.getElementById('reg-email').value,
        cpf: cpfValor,
        senha: document.getElementById('reg-senha').value
    };

    if (tipo === 'discente') {
        dadosCadastro.matricula = document.getElementById('reg-matricula').value;
    }

    try {
        const response = await fetch(`${API_BASE}/${tipo}s`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCadastro)
        });

        if (response.ok) {
            alert(`Cadastro realizado com sucesso!`);
            showLogin();
            this.reset();
        } else {
            alert(`Erro no servidor. Verifique se os dados já existem.`);
        }
    } catch (error) {
        alert("Erro de conexão com o servidor.");
    }
});

// 6. Funções de Auxílio (UI)
function showRegister() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-screen').style.display = 'flex';
}

function showLogin() {
    document.getElementById('register-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

function toggleFields() {
    const tipo = document.getElementById('reg-tipo').value;
    document.getElementById('fields-discente').style.display = (tipo === 'discente') ? 'block' : 'none';
    document.getElementById('fields-docente').style.display = (tipo === 'docente') ? 'block' : 'none';
    document.getElementById('fields-tecnico').style.display = (tipo === 'tecnico') ? 'block' : 'none';
}

function realizarLogout() {
    if(confirm('Deseja realmente sair?')) {
        sessionStorage.removeItem('usuarioLogado');
        document.getElementById('app-sistema').style.display = 'none';
        document.getElementById('formLogin').reset();
        document.getElementById('login-screen').style.display = 'flex';
    }
}

// 7. Lógica de Projetos (Exemplo de GET)
async function carregarProjetosDoBanco() {
    try {
        const response = await fetch("http://localhost:8080/api/projetos"); 
        if (response.ok) {
            projetos = await response.json();
            renderProjetos();
        }
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);
    }
}

function renderProjetos() {
    const tbody = document.querySelector('#tabela-projetos tbody');
    if (!tbody) return;
    tbody.innerHTML = ''; 

    projetos.forEach(proj => {
        const row = `
            <tr>
                <td>${proj.id}</td>
                <td><strong>${proj.titulo}</strong></td>
                <td>${formatDate(proj.inicio)}</td>
                <td>${situacaoMap[proj.situacao]}</td>
                <td>
                    <button onclick="deleteProjeto('${proj.id}')" style="border:none; background:none; cursor:pointer; color: red;">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}
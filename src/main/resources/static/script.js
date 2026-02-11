// 1. Configurações Globais
const API_BASE = "http://localhost:8080/api/participantes";
const API_PROJETOS = "http://localhost:8080/api/projetos";

let projetos = []; // Variável global que armazenará os dados

const situacaoMap = {
    'PLANEJAMENTO': '<span style="color:orange">Em Planejamento</span>',
    'ANDAMENTO': '<span style="color:green">Em Andamento</span>',
    'CONCLUIDO': '<span style="color:blue">Concluído</span>',
    'SUSPENSO': '<span style="color:red">Suspenso</span>'
};

// 2. Inicialização e Navegação
document.addEventListener('DOMContentLoaded', () => {
    const usuarioSalvo = sessionStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        const userNameEl = document.querySelector('.user-info strong');
        if (userNameEl) userNameEl.innerText = usuario.nome;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-sistema').style.display = 'flex';
        navigateTo('dashboard');
    }
});


// 2. Inicialização e Navegação (Simplificado para o que importa)
document.addEventListener('DOMContentLoaded', () => {
    const usuarioSalvo = sessionStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        const userNameEl = document.querySelector('.user-info strong');
        if (userNameEl) userNameEl.innerText = usuario.nome;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-sistema').style.display = 'flex';
        navigateTo('dashboard');
    }
});



function navigateTo(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active-view');
    
    if (viewId === 'projects-list') carregarProjetosDoBanco();
}

// 3. Carregamento de Dados (CORREÇÃO DE VARIÁVEL)
async function carregarProjetosDoBanco() {
    try {
        const response = await fetch(API_PROJETOS);
        if (response.ok) {
            // CORREÇÃO: Removemos o "const" para atualizar a variável GLOBAL let projetos
            projetos = await response.json(); 
            renderProjetos();
        }
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);
    }
}

// 4. Renderização (CORREÇÃO DE PARÂMETROS)
function renderProjetos() {
    const tbody = document.querySelector('#tabela-projetos tbody');
    if (!tbody) return;
    tbody.innerHTML = ''; 

    projetos.forEach(proj => {
        const dataParaExibir = proj.dataInicio;
        const statusHTML = situacaoMap[proj.situacao] || `<span>${proj.situacao}</span>`;

        const row = `
            <tr>
                <td>${proj.id}</td>
                <td><strong>${proj.titulo}</strong></td>
                <td>${formatDate(dataParaExibir)}</td>
                <td>${statusHTML}</td>
                <td>
                    <button onclick="deleteProjeto('${proj.codigoUnico}')" style="border:none; background:none; cursor:pointer; color: red;">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// 5. Formatação de Data
function formatDate(dateString) {
    if (!dateString) return '-';
    const partes = dateString.split('-'); 
    if (partes.length < 3) return dateString;
    const [year, month, day] = partes;
    return `${day}/${month}/${year}`;
}

// 6. Delete (CORREÇÃO DE URL)
async function deleteProjeto(codigo) {
    if (!confirm(`Deseja excluir o projeto ${codigo}?`)) return;
    
    try {
        // CORREÇÃO: A URL correta conforme seu ProjetoController.java
        const res = await fetch(`${API_PROJETOS}/codigo/${codigo}`, { 
            method: 'DELETE' 
        });

        if (res.ok) {
            alert("Projeto excluído com sucesso!");
            carregarProjetosDoBanco(); 
        } else if (res.status === 409) {
            // Caso o Java retorne erro de vínculos ativos
            const msg = await res.text();
            alert(msg);
        } else {
            alert("Erro ao deletar projeto.");
        }
    } catch (err) { 
        alert("Erro de conexão com o servidor."); 
    }
}
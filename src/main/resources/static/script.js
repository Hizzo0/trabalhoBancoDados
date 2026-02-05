const form = document.getElementById('formDocente');
const mensagemDiv = document.getElementById('mensagem');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Criando o objeto com departamento como STRING
    const docente = {
        cpf: document.getElementById('cpf').value,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        ativo: true,
        senha: "123", 
        departamento: document.getElementById('idDepartamento').value // Enviando como String
    };

    try {
        const response = await fetch('http://localhost:8080/api/participantes/docentes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(docente)
        });

        if (response.ok) {
            mensagemDiv.style.color = "green";
            mensagemDiv.innerText = "Sucesso! Docente cadastrado.";
            form.reset();
        } else {
            const erroTexto = await response.text();
            mensagemDiv.style.color = "red";
            mensagemDiv.innerText = "Erro: " + erroTexto;
        }
    } catch (error) {
        mensagemDiv.style.color = "red";
        mensagemDiv.innerText = "Erro ao conectar com o Backend.";
    }
});
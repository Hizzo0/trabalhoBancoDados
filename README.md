# SIGPesq — Sistema de Gestão de Pesquisa Acadêmica

O **SIGPesq** é uma plataforma desenvolvida para gerir o ciclo de vida de pesquisas acadêmicas, integrando a gestão de projetos, o controle de financiamentos e o registro de produções científicas. O sistema atende a três perfis principais: **Docentes**, **Discentes** e **Técnicos-Administrativos**.

---

## 🚀 Pré-requisitos

Antes de iniciar, você precisará ter instalado em sua máquina:

- **Java JDK 17** ou superior
- **Node.js 18** ou superior
- **MySQL 8.0** ou superior

---

## 🛠️ Configuração do Backend (Spring Boot)

O backend gerencia as regras de negócio e a persistência de dados.

**1. Acesse a pasta do backend:**

```bash
cd backend
```

**2. Configure o Banco de Dados:**

Crie um esquema no MySQL chamado `sigpesq` e edite o arquivo `src/main/resources/application.properties` com suas credenciais:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sigpesq
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

**3. Inicie a aplicação:**

Limpe compilações anteriores:

```bash
./mvnw clean
```

Execute o servidor (pulando os testes):

```bash
./mvnw spring-boot:run -DskipTests
```

---

## 💻 Configuração do Frontend (Next.js)

A interface permite a interação dos usuários com os projetos e recursos.

**1. Acesse a pasta do frontend:**

```bash
cd frontend
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as Variáveis de Ambiente:**

Crie um arquivo `.env.local` na raiz da pasta `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

**4. Inicie o ambiente de desenvolvimento:**

```bash
npm run dev
```

---

## 📋 Funcionalidades Principais (Casos de Uso)

O sistema foi construído com base nos seguintes requisitos:

| Funcionalidade | Descrição | Casos de Uso |
|---|---|---|
| **Gestão de Projetos** | Cadastro, alteração e remoção de pesquisas acadêmicas | UC03 |
| **Financiamentos** | Controle de recursos financeiros e agências de fomento | UC04 / UC07 |
| **Produções Científicas** | Registro de artigos, teses e livros vinculados | UC05 / UC08 |
| **Participantes** | Autocadastro de Docentes, Discentes e Técnicos | UC01, UC02, UC15 |
| **Relatórios** | Consulta de participantes em múltiplos projetos | UC11 |

---

## 👥 Autores

- Caio Santana
- Danyllo Rangel
- Italo Henzo Gomes Ferreira
- Lucas de Souza Gratky
- Luiza Pauli

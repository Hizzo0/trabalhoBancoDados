-- 1. Resetar o Banco de Dados
DROP DATABASE IF EXISTS db_sigpesq;
CREATE DATABASE db_sigpesq;
USE db_sigpesq;

-- Criar o Banco de Dados e as Tabelas, o Spring Boot com JPA/Hibernate
-- pode criar as tabelas automaticamente, mas aqui está o SQL para criar as tabelas manualmente se quiser:
CREATE TABLE participante (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cpf VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    nome VARCHAR(255),
    senha VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE financiamento (
    id BIGINT NOT NULL AUTO_INCREMENT,
    valor_total DOUBLE,
    agencia_financiador VARCHAR(255),
    tipo_fomento VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE=InnoDB;


CREATE TABLE docente (
    id BIGINT NOT NULL,
    departamento VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES participante (id)
) ENGINE=InnoDB;

CREATE TABLE discente (
    id BIGINT NOT NULL,
    matricula VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES participante (id)
) ENGINE=InnoDB;

CREATE TABLE tecnico (
    id BIGINT NOT NULL,
    cargo VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES participante (id)
) ENGINE=InnoDB;


CREATE TABLE projeto (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo_unico VARCHAR(255) UNIQUE,
    titulo VARCHAR(255),
    descricao VARCHAR(1000),
    situacao VARCHAR(255),
    data_inicio DATE,
    data_fim DATE,
    coordenador_id BIGINT,
    financiamento_id BIGINT UNIQUE,
    PRIMARY KEY (id),
    FOREIGN KEY (coordenador_id) REFERENCES docente (id),
    FOREIGN KEY (financiamento_id) REFERENCES financiamento (id)
) ENGINE=InnoDB;

CREATE TABLE vinculo_participacao (
    id BIGINT NOT NULL AUTO_INCREMENT,
    projeto_id BIGINT,
    participante_id BIGINT,
    funcao_desempenhada VARCHAR(255),
    data_entrada DATE,
    data_saida DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (projeto_id) REFERENCES projeto (id),
    FOREIGN KEY (participante_id) REFERENCES participante (id)
) ENGINE=InnoDB;

-- 5. Inserir dados para o Logar de Primeira (se quiser testar o login)
INSERT INTO participante (cpf, email, nome, senha) VALUES ('123', 'docente@teste.com', 'Professor Admin', '123');
INSERT INTO docente (id, departamento) VALUES (1, 'Computação');
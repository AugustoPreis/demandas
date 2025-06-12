CREATE TABLE empresas (
	id serial NOT NULL PRIMARY KEY,
	logo bytea,
	razao_social varchar(150) NOT NULL,
	nome_fantasia varchar(150),
	cnpj char(14) NOT NULL,
	telefone varchar(13),
	email varchar(100) NOT NULL,
	ativo bool NOT NULL,
	data_cadastro timestamp NOT NULL
);

CREATE TABLE usuarios (
	id serial NOT NULL PRIMARY KEY,
	nome varchar(100) NOT NULL,
	email varchar(100) NOT NULL,
  senha text NOT NULL,
	observacoes text,
	adm bool NOT NULL,
	escolhe_demandas bool NOT NULL,
	ativo bool NOT NULL,
	data_cadastro timestamp NOT NULL,
	empresa_id int NOT NULL REFERENCES empresas
);

CREATE TABLE situacoes (
	id serial NOT NULL PRIMARY KEY,
	descricao varchar(30),
	ativo bool NOT NULL,
	data_cadastro timestamp NOT NULL,
	empresa_id int NOT NULL REFERENCES empresas
);

CREATE TABLE clientes (
	id serial NOT NULL PRIMARY KEY,
	nome varchar(100),
	telefone varchar(13),
	email varchar(100) NOT NULL,
	observacoes text,
	ativo bool NOT NULL,
	data_cadastro timestamp NOT NULL,
	empresa_id int NOT NULL REFERENCES empresas
);

CREATE TABLE demandas (
	id serial NOT NULL PRIMARY KEY,
	numero int NOT NULL,
	titulo varchar(100),
	descricao text,
	situacao_id int NOT NULL REFERENCES situacoes,
	prioridade varchar(10) NOT NULL,
	cliente_id int REFERENCES clientes,
	data_previsao date,
	ativo bool NOT NULL,
	data_cadastro timestamp NOT NULL,
	usuario_id int REFERENCES usuarios,
	empresa_id int NOT NULL REFERENCES empresas
);

CREATE TABLE anexos_demanda (
	id serial NOT NULL PRIMARY KEY,
	demanda_id int NOT NULL REFERENCES demandas,
	uuid uuid NOT NULL,
	nome varchar(100),
	arquivo bytea NOT NULL,
	data_cadastro timestamp NOT NULL,
	empresa_id int NOT NULL REFERENCES empresas
);

CREATE TABLE trabalhos_demanda (
	id serial NOT NULL PRIMARY KEY,
	demanda_id int NOT NULL REFERENCES demandas,
	usuario_id int NOT NULL REFERENCES usuarios,
	data_inicio timestamp NOT NULL,
	data_fim timestamp,
	situacao_id int NOT NULL REFERENCES situacoes,
	data_cadastro timestamp NOT NULL,
	empresa_id int NOT NULL REFERENCES empresas
);

INSERT INTO empresas (
	razao_social,
	nome_fantasia,
	cnpj,
	email,
	data_cadastro,
	ativo
) VALUES (
	'EMPRESA 1',
	'Empresa 1',
	'00000000000000',
	'empresa1@gmail.com',
	current_timestamp,
	TRUE
);

INSERT INTO usuarios (
	nome,
	email,
	senha,
	adm,
	escolhe_demandas,
	ativo,
	data_cadastro,
	empresa_id
) VALUES (
	'ADMIN',
	'admin@gmail.com',
	'$2b$10$EnwBQKjJ2VMIGyVL9Quh5ebSQynUJTNt4I179wPKPMip/mIikB5sq', --senha: 10
	TRUE,
	TRUE,
	TRUE,
	current_timestamp,
	1
);

INSERT INTO situacoes (
	descricao,
	ativo,
	data_cadastro,
	empresa_id
) VALUES
	('Aberta', TRUE, current_timestamp, 1),
	('Em andamento', TRUE, current_timestamp, 1),
	('Finalizada', TRUE, current_timestamp, 1),
	('Cancelada', TRUE, current_timestamp, 1);

INSERT INTO clientes (
	nome,
	email,
	ativo,
	data_cadastro,
	empresa_id
) VALUES
	('Facebook', 'contato@facebook.com', TRUE, current_timestamp, 1),
	('Google', 'contato@gmail.com', TRUE, current_timestamp, 1),
	('Samsung', 'contato@samsung.com', TRUE, current_timestamp, 1),
	('Apple', 'contato@apple.com', TRUE, current_timestamp, 1),
	('Microsoft', 'contato@microsoft.com', TRUE, current_timestamp, 1);
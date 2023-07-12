drop table if exists permissao cascade;
drop table if exists token cascade;
drop table if exists usuario cascade;
drop table if exists solicitacao_amizade cascade;
drop table if exists perfil_usuario cascade;
drop table if exists chat cascade;
drop table if exists amigos cascade;
drop table if exists mensagem cascade;
drop table if exists ano cascade;
drop table if exists mes cascade;
drop table if exists dia cascade;
drop table if exists index cascade;
drop table if exists evento cascade;
drop type if exists valid_week_days;
drop type if exists valid_months;

CREATE TYPE valid_week_days AS ENUM ('DOMINGO', 'SEGUNDA_FEIRA', 'TERCA_FEIRA', 'QUARTA_FEIRA', 'QUINTA_FEIRA', 'SEXTA_FEIRA', 'SABADO');
CREATE TYPE valid_months AS ENUM ('JANEIRO', 'FEVEREIRO', 'MARÇO', 'MAIO', 'ABRIL', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO');

CREATE TABLE usuario (
	id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL unique,
	senha VARCHAR(100) NOT NULL,
	ativo BOOLEAN NOT NULL
);
ALTER TABLE usuario ADD CONSTRAINT pk_usuario PRIMARY KEY (id);
ALTER TABLE usuario ADD CONSTRAINT uk_usuario_email UNIQUE (email);


create table token (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    token text not null,
    id_usuario bigint not null,
    is_expired boolean not null
);

alter table token add constraint pk_token primary key (id);
alter table token add constraint fk_id_usuario foreign key (id_usuario) references usuario;


CREATE TABLE permissao (
	id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
	nome VARCHAR(100) NOT NULL,
	usuario_id BIGINT NOT NULL
);
ALTER TABLE permissao ADD CONSTRAINT pk_permissao PRIMARY KEY (id);
ALTER TABLE permissao ADD CONSTRAINT uk_permissao UNIQUE (nome, usuario_id);
ALTER TABLE permissao ADD CONSTRAINT fk_permissao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario;

create table perfil_usuario (
	id bigint generated by default as identity not null,
	imagem_perfil Text,
	id_usuario bigint not null
);

alter table perfil_usuario add constraint pk_perfil_usuario primary key (id);
alter table perfil_usuario add constraint fk_perfil_usuario_id_usuario foreign key (id_usuario) references usuario;

create table amigos (
	id_usuario1 bigint not null,
	id_usuario2 bigint not null
);

alter table amigos add constraint fk_amigos_id_usuario1 foreign key (id_usuario1) references usuario;
alter table amigos add constraint fk_amigos_id_usuario2 foreign key (id_usuario2) references usuario;

create table solicitacao_amizade (
	id_usuario1 bigint not null,
	id_usuario2 bigint not null
);

alter table solicitacao_amizade add constraint fk_solicitacao_amizade_id_usuario1 foreign key (id_usuario1) references usuario;
alter table solicitacao_amizade add constraint fk_solicitacao_amizade_id_usuario2 foreign key (id_usuario2) references usuario;

create table chat (
    id bigint generated by default as identity not null,
    id_usuario bigint not null,
    id_destinatario bigint not null
);

alter table chat add constraint pk_chat primary key (id);
alter table chat add constraint fk_chat_id_usuario foreign key (id_usuario) references usuario;


create table mensagem (
    id bigint generated by default as identity not null,
    id_usuario bigint not null,
    id_destinatario bigint not null,
    id_chat bigint not null,
    index int not null,
    mensagem text not null
);

alter table mensagem add constraint pk_mensagem primary key (id);
alter table mensagem add constraint fk_mensagem_id_usuario foreign key (id_usuario) references usuario;
alter table mensagem add constraint fk_mensagem_id_destinatario foreign key (id_destinatario) references usuario;

create table ano (
    id bigint generated by default as identity not null,
    ano_value int not null,
    id_usuario bigint not null
);

alter table ano add constraint pk_ano primary key (id);
alter table ano add constraint fk_id_usuario foreign key (id_usuario) references usuario;

create table mes (
    id bigint generated by default as identity not null,
    id_ano bigint not null,
    mes valid_months not null
);

alter table mes add constraint pk_mes primary key (id);
alter table mes add constraint fk_id_ano foreign key (id_ano) references ano;

create table dia (
    id bigint generated by default as identity not null,
    dia_da_semana valid_week_days not null,
    dia_valor int not null,
    id_mes bigint not null
);

alter table dia add constraint pk_dia primary key (id);
alter table dia add constraint fk_id_mes foreign key (id_mes) references mes;

create table index (
    id bigint generated by default as identity not null,
    id_dia bigint not null,
    index_name varchar(25) not null,
    index_content varchar(50) not null,
    index text not null
);

alter table index add constraint pk_indexes primary key (id);
alter table index add constraint fk_id_dia foreign key (id_dia) references dia;

create table evento (
    id bigint generated by default as identity not null,
    descricao text not null,
    titulo varchar(50) not null,
    tempo time,
    data_notificacao timestamp,
    scheduler_name varchar(50),
    scheduler_group varchar(50),
    id_dia bigint not null
);

alter table evento add constraint pk_evento primary key (id);
alter table evento add constraint fk_id_dia foreign key (id_dia) references dia;
drop table if exists permissao cascade;
drop table if exists usuario cascade;
drop table if exists amigos cascade;
drop table if exists mensagem cascade;


CREATE TABLE usuario (
	id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL unique,
	senha VARCHAR(100) NOT NULL,
	ativo BOOLEAN NOT NULL
);
ALTER TABLE usuario ADD CONSTRAINT pk_usuario PRIMARY KEY (id);
ALTER TABLE usuario ADD CONSTRAINT uk_usuario_email UNIQUE (email);


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
alter table perfil_usuario add constraint fk_perfil_usuario_usuario foreign key (id_usuario) references usuario;

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
alter table chat add constraint fk_conversa_usuario_id_usuario1 foreign key (id_usuario1) references usuario;
alter table chat add constraint fk_conversa_usuario_id_usuario2 foreign key (id_usuario2) references usuario;

create table mensagem (
    id bigint generated by default as identity not null,
    id usuario bigint not null,
    id_chat bigint not null,
    mensagem text not null
);

alter table mensagem add constraint pk_mensagem primary key (id);
alter table mensagem add constraint fk_mensagem_id_usuario foreign key (id_usuario) references usuario;
alter table mensagem add constraint fk_mensagem_id_destinatario foreign key (id_destinatario) references usuario;


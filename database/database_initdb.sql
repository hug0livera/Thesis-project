/*CREATE DATABASE letMeTag
  WITH OWNER = root
  ENCODING = 'UTF8'
  TABLESPACE = pg_default
  LC_COLLATE = 'it_IT.UTF-8'
  LC_CTYPE = 'it_IT.UTF-8'
  CONNECTION LIMIT = -1;
*/

/*Table Users. All users are saved here during their registration.*/
create table Users (
	id_user serial Primary Key,
	id_telegram integer,
	name varchar(40),
	email varchar(150),
	password varchar(200), 
	phone varchar(20),
	date_registration Timestamp default CURRENT_TIMESTAMP,
	last_access Timestamp default CURRENT_TIMESTAMP,
	/*Columns for administrator*/
	administrator boolean default FALSE,
	gender varchar(1),
	lang varchar(3),
	id_last_task integer,
	day_reminder integer  default 0,
	observer boolean default FALSE,
	invited_user boolean default FALSE,
	user_deleted boolean default FALSE

);

/*Table task.It contains all task create by an administrator*/
create type state_enum as ENUM ('active','inactive','inConstruction');
create table Task (
	id_task serial Primary Key,
	task_name varchar(50) not null,
	task_description varchar(200) default '',
	state state_enum default ('inConstruction'),
	chance_value float default 0.0, /*valore di casualità*/
	random_threshold float default 0.0, /*valore di soglia*/
	link_to_guidelines varchar(200) default '',
	threshold integer default 3,
	creator bigint,
	foreign key (creator) references Users(id_user) on delete cascade
);

/*Table users_task.It contains all user for every task*/
create table Users_task (
	id_task integer,
	id_user bigint,
	administrator boolean default FALSE,
	active boolean default TRUE,
	Primary Key (id_task, id_user),
	foreign key (id_task) references Task(id_task) on delete cascade,
	foreign key (id_user) references Users(id_user) on delete cascade
);

/*Table Tag_categories. It contains the categories of a task*/
create table Tag_category(
	id_category serial Primary Key,
  	id_task integer not null,
	tag_category_name varchar(50) not null,
	index integer not null,
 	mandatory boolean default FALSE,
 	multi_choice boolean default FALSE,
	foreign key (id_task) references Task(id_task) on delete cascade
);

/*Table tag.It contains all tag of every tasks*/
create table Tag(
	id_tag serial Primary Key,
  	id_category integer,
	tag_name varchar(50),
	color char(7),
  	behavior integer default NULL,
		index integer not null,

	foreign key (id_category) references Tag_category(id_category) on delete set null
);

/*Table posts. It contains all post downloaded from social networks*/
create table Post (
	id_post serial Primary Key,
	id_task integer,
	uri varchar(250),
	text text,
	data Timestamp default CURRENT_TIMESTAMP,
	total_annotation integer default 0,
	category varchar(50),
	info varchar(300),
  	image_name varchar(200),
	image_path varchar (250)
);

/*Table Annotations. All annotations done by users are saved here.*/
create table Annotation (
	id_user bigint,
	id_post integer,
  	id_tag integer, 
	date_annotation Timestamp,
	index_annotation integer,
	Primary Key (id_user, id_post, id_tag),
	foreign key (id_post) references Post(id_post) on delete cascade,
	foreign key (id_user) references Users(id_user) on delete cascade,
	foreign key (id_tag) references Tag(id_tag) on delete cascade
);

create or replace function public.remind_day()
returns trigger
language plpgsql
as $function$
begin
  perform pg_notify('telenot',row_to_json(NEW)::text);
  return NULL;
end;
$function$

CREATE TRIGGER days
AFTER UPDATE on users 
FOR EACH ROW 
WHEN (OLD.day_reminder    IS DISTINCT FROM NEW.day_reminder)
EXECUTE PROCEDURE remind_day();

create extension pgcrypto; 

/*Inserire primo utente amministratore*/
insert into Users (email, phone, password, id_telegram, date_registration, last_access, administrator, invited_user)
values ('admin', '',  '', 111111 ,default, default, TRUE, TRUE); 
/*Impostazione della password prova amministratore*/
 update Users set password = crypt('admin', gen_salt('bf', 8)) where id_user = 1;  
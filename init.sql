create table Product_type 
(
	id serial primary key,
	type_name varchar(55) not null,
	product_type_factor numeric(10, 3)
);

create table Products
(
	id serial primary key,
	article varchar(15) not null,
	product_type_id int references Product_type(id),
	product_name varchar(55) not null,
	min_price numeric(10, 2)
);

create table Material_type 
(
	id serial primary key,
	type_name varchar(55) not null,
	loss_percent numeric(10, 2)
);

create table Materials
(
	id serial primary key,
	material_name varchar(55) not null,
	material_type_id int references Material_type(id),
	price numeric(10, 2),
	quantity_stock numeric(10, 2),
	min_quantity numeric(10, 2),
	quantity_package numeric(10, 2),
	unit varchar(5) not null
);

create table Material_products
(
	id serial primary key,
	material_id int references Materials(id),
	product_id int references Products(id),
	quantity numeric(10, 3)
)
-- Honeyent ERP Complete Database Schema (Bigint Keys)

-- 1. Company Profile
CREATE TABLE IF NOT EXISTS public.company_profile (
	id bigserial NOT NULL,
	"name" varchar(255) NOT NULL,
	gst varchar(50) NULL,
	address text NULL,
	city varchar(100) NULL,
	state varchar(100) NULL,
	phone varchar(50) NULL,
	email varchar(255) NULL,
	logo_text varchar(100) NULL,
	owner_name varchar(100) NULL,
	owner_phone varchar(50) NULL,
	owner_email varchar(255) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT company_profile_gst_key UNIQUE (gst),
	CONSTRAINT company_profile_pkey PRIMARY KEY (id)
);

-- 2. Customers
CREATE TABLE IF NOT EXISTS public.customers (
	id bigserial NOT NULL,
	code varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	gst varchar(50) NULL,
	mobile varchar(50) NULL,
	email varchar(255) NULL,
	address text NULL,
	city varchar(100) NULL,
	state varchar(100) NULL,
	credit_limit numeric(15, 2) DEFAULT 0 NULL,
	opening_balance numeric(15, 2) DEFAULT 0 NULL,
	outstanding numeric(15, 2) DEFAULT 0 NULL,
	status varchar(20) DEFAULT 'Active'::character varying NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT customers_code_key UNIQUE (code),
	CONSTRAINT customers_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_customer_code ON public.customers USING btree (code);
CREATE INDEX IF NOT EXISTS idx_customer_gst ON public.customers USING btree (gst);

-- 3. Calendar Dimension
CREATE TABLE IF NOT EXISTS public.dim_calendar (
	date_key int4 NOT NULL,
	calendar_date date NOT NULL,
	day_of_month int4 NULL,
	day_name varchar(20) NULL,
	day_of_week int4 NULL,
	week_of_year int4 NULL,
	month_number int4 NULL,
	month_name varchar(20) NULL,
	quarter_number int4 NULL,
	year_number int4 NULL,
	is_weekend bool NULL,
	CONSTRAINT dim_calendar_calendar_date_key UNIQUE (calendar_date),
	CONSTRAINT dim_calendar_pkey PRIMARY KEY (date_key)
);

-- 4. Drivers
CREATE TABLE IF NOT EXISTS public.drivers (
	id bigserial NOT NULL,
	"name" varchar(255) NOT NULL,
	mobile varchar(50) NULL,
	email varchar(255) NULL,
	address text NULL,
	license_number varchar(50) NOT NULL,
	license_expiry date NULL,
	joining_date date NULL,
	status varchar(20) DEFAULT 'Active'::character varying NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT drivers_license_number_key UNIQUE (license_number),
	CONSTRAINT drivers_mobile_key UNIQUE (mobile),
	CONSTRAINT drivers_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_driver_license ON public.drivers USING btree (license_number);
CREATE INDEX IF NOT EXISTS idx_driver_mobile ON public.drivers USING btree (mobile);

-- 5. Expense Heads
CREATE TABLE IF NOT EXISTS public.expense_heads (
	id bigserial NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	code varchar(20) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT expense_heads_code_key UNIQUE (code),
	CONSTRAINT expense_heads_name_key UNIQUE (name),
	CONSTRAINT expense_heads_pkey PRIMARY KEY (id)
);

-- 6. HSN Catalog
CREATE TABLE IF NOT EXISTS public.hsn_catalog (
	id bigserial NOT NULL,
	hsn_code varchar(8) NOT NULL,
	description varchar(255) NULL,
	gst_rate numeric(5, 2) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT hsn_catalog_hsn_code_key UNIQUE (hsn_code),
	CONSTRAINT hsn_catalog_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_hsn_code ON public.hsn_catalog USING btree (hsn_code);

-- 7. Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
	id bigserial NOT NULL,
	code varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	gst varchar(50) NULL,
	mobile varchar(50) NULL,
	email varchar(255) NULL,
	address text NULL,
	city varchar(100) NULL,
	state varchar(100) NULL,
	bank_name varchar(100) NULL,
	bank_account varchar(30) NULL,
	bank_ifsc varchar(11) NULL,
	opening_balance numeric(15, 2) DEFAULT 0 NULL,
	outstanding numeric(15, 2) DEFAULT 0 NULL,
	status varchar(20) DEFAULT 'Active'::character varying NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT suppliers_code_key UNIQUE (code),
	CONSTRAINT suppliers_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_supplier_code ON public.suppliers USING btree (code);
CREATE INDEX IF NOT EXISTS idx_supplier_gst ON public.suppliers USING btree (gst);

-- 8. Users
CREATE TABLE IF NOT EXISTS public.users (
	user_id serial4 NOT NULL,
	employee_code varchar(20) NOT NULL,
	user_name varchar(100) NOT NULL,
	email varchar(150) NULL,
	department varchar(100) NULL,
	designation varchar(100) NULL,
	joining_date date NULL,
	status varchar(20) DEFAULT 'ACTIVE'::character varying NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT users_employee_code_key UNIQUE (employee_code),
	CONSTRAINT users_pkey PRIMARY KEY (user_id)
);

-- Update users table to support authentication and authorization
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash varchar(255) NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role varchar(50) DEFAULT 'admin' NULL;

-- 9. Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
	id bigserial NOT NULL,
	"number" varchar(50) NOT NULL,
	vehicle_type varchar(50) NULL,
	ownership varchar(20) DEFAULT 'Own'::character varying NULL,
	capacity_tonnes numeric(10, 2) NULL,
	rc_expiry date NULL,
	insurance_expiry date NULL,
	fitness_expiry date NULL,
	permit_expiry date NULL,
	puc_expiry date NULL,
	status varchar(20) DEFAULT 'Active'::character varying NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT vehicles_number_key UNIQUE (number),
	CONSTRAINT vehicles_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_vehicle_number ON public.vehicles USING btree (number);

-- 10. Products
CREATE TABLE IF NOT EXISTS public.products (
	id bigserial NOT NULL,
	code varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	hsn_id int8 NULL,
	unit varchar(20) DEFAULT 'MT'::character varying NULL,
	gst_rate numeric(5, 2) NULL,
	default_rate numeric(15, 2) NULL,
	category varchar(100) NULL,
	status varchar(20) DEFAULT 'Active'::character varying NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT products_code_key UNIQUE (code),
	CONSTRAINT products_pkey PRIMARY KEY (id),
	CONSTRAINT products_hsn_id_fkey FOREIGN KEY (hsn_id) REFERENCES public.hsn_catalog(id)
);
CREATE INDEX IF NOT EXISTS idx_product_code ON public.products USING btree (code);

-- 11. Trips
CREATE TABLE IF NOT EXISTS public.trips (
	id bigserial NOT NULL,
	trip_no varchar(50) NOT NULL,
	trip_date date NOT NULL,
	vehicle_id int8 NULL,
	driver_id int8 NULL,
	"source" varchar(255) NULL,
	destination varchar(255) NULL,
	weight numeric(10, 2) NULL,
	revenue numeric(15, 2) NULL,
	trip_expenses numeric(15, 2) DEFAULT 0 NULL,
	net_profit numeric(15, 2) NULL,
	deal_id int8 NULL,
	status varchar(30) DEFAULT 'Pending'::character varying NULL,
	cancelled bool DEFAULT false NULL,
	cancel_remark text NULL,
	cancelled_at timestamp NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT trips_pkey PRIMARY KEY (id),
	CONSTRAINT trips_trip_no_key UNIQUE (trip_no),
	CONSTRAINT trips_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id),
	CONSTRAINT trips_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE INDEX IF NOT EXISTS idx_trip_no ON public.trips USING btree (trip_no);

-- 12. Weigh Slips
CREATE TABLE IF NOT EXISTS public.weigh_slips (
	id bigserial NOT NULL,
	slip_no varchar(50) NOT NULL,
	slip_date date NOT NULL,
	vehicle_id int8 NULL,
	product_id int8 NULL,
	gross_weight numeric(10, 2) NULL,
	tare_weight numeric(10, 2) NULL,
	net_weight numeric(10, 2) NULL,
	customer_weight numeric(10, 2) NULL,
	loss_weight numeric(10, 2) NULL,
	deal_id int8 NULL,
	status varchar(30) DEFAULT 'Draft'::character varying NULL,
	cancelled bool DEFAULT false NULL,
	cancel_remark text NULL,
	cancelled_at timestamp NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT weigh_slips_pkey PRIMARY KEY (id),
	CONSTRAINT weigh_slips_slip_no_key UNIQUE (slip_no),
	CONSTRAINT weigh_slips_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
	CONSTRAINT weigh_slips_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE INDEX IF NOT EXISTS idx_weighslip_no ON public.weigh_slips USING btree (slip_no);

-- 13. Orders
CREATE TABLE IF NOT EXISTS public.orders (
	id bigserial NOT NULL,
	order_no varchar(50) NOT NULL,
	order_date date NOT NULL,
	customer_id int8 NOT NULL,
	supplier_id int8 NULL,
	product_id int8 NOT NULL,
	qty numeric(10, 2) NULL,
	rate numeric(15, 2) NULL,
	vehicle_id int8 NULL,
	driver_id int8 NULL,
	ship_to_address_id int8 NULL,
	freight numeric(15, 2) DEFAULT 0 NULL,
	payment_terms varchar(100) NULL,
	expected_delivery date NULL,
	remarks text NULL,
	status varchar(30) DEFAULT 'Pending'::character varying NULL,
	dispatch_no varchar(50) NULL,
	deal_id int8 NULL,
	cancelled bool DEFAULT false NULL,
	cancel_remark text NULL,
	cancelled_at timestamp NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT orders_order_no_key UNIQUE (order_no),
	CONSTRAINT orders_pkey PRIMARY KEY (id),
	CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
	CONSTRAINT orders_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id),
	CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
	CONSTRAINT orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
	CONSTRAINT orders_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE INDEX IF NOT EXISTS idx_order_customer ON public.orders USING btree (customer_id);
CREATE INDEX IF NOT EXISTS idx_order_date ON public.orders USING btree (order_date);
CREATE INDEX IF NOT EXISTS idx_order_no ON public.orders USING btree (order_no);

-- 14. Purchase Invoices
CREATE TABLE IF NOT EXISTS public.purchase_invoices (
	id bigserial NOT NULL,
	invoice_no varchar(50) NOT NULL,
	invoice_date date NOT NULL,
	supplier_id int8 NOT NULL,
	order_id int8 NULL,
	deal_id int8 NULL,
	sub_total numeric(15, 2) NULL,
	gst_amount numeric(15, 2) NULL,
	total_amount numeric(15, 2) NULL,
	payment_status varchar(20) DEFAULT 'Unpaid'::character varying NULL,
	status varchar(30) DEFAULT 'Draft'::character varying NULL,
	cancelled bool DEFAULT false NULL,
	cancel_remark text NULL,
	cancelled_at timestamp NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT purchase_invoices_invoice_no_key UNIQUE (invoice_no),
	CONSTRAINT purchase_invoices_pkey PRIMARY KEY (id),
	CONSTRAINT purchase_invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
	CONSTRAINT purchase_invoices_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id)
);
CREATE INDEX IF NOT EXISTS idx_purchase_no ON public.purchase_invoices USING btree (invoice_no);

-- 15. Sales Invoices
CREATE TABLE IF NOT EXISTS public.sales_invoices (
	id bigserial NOT NULL,
	invoice_no varchar(50) NOT NULL,
	invoice_date date NOT NULL,
	customer_id int8 NOT NULL,
	order_id int8 NULL,
	deal_id int8 NULL,
	sub_total numeric(15, 2) NULL,
	cgst_amount numeric(15, 2) DEFAULT 0 NULL,
	sgst_amount numeric(15, 2) DEFAULT 0 NULL,
	igst_amount numeric(15, 2) DEFAULT 0 NULL,
	total_amount numeric(15, 2) NULL,
	payment_status varchar(20) DEFAULT 'Unpaid'::character varying NULL,
	status varchar(30) DEFAULT 'Draft'::character varying NULL,
	cancelled bool DEFAULT false NULL,
	cancel_remark text NULL,
	cancelled_at timestamp NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT sales_invoices_invoice_no_key UNIQUE (invoice_no),
	CONSTRAINT sales_invoices_pkey PRIMARY KEY (id),
	CONSTRAINT sales_invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
	CONSTRAINT sales_invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE INDEX IF NOT EXISTS idx_invoice_no ON public.sales_invoices USING btree (invoice_no);

-- 16. Trip Expenses
CREATE TABLE IF NOT EXISTS public.trip_expenses (
	id bigserial NOT NULL,
	trip_id int8 NOT NULL,
	expense_head_id int8 NOT NULL,
	amount numeric(15, 2) NULL,
	remarks text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT public.trip_expenses_pkey PRIMARY KEY (id),
	CONSTRAINT trip_expenses_expense_head_id_fkey FOREIGN KEY (expense_head_id) REFERENCES public.expense_heads(id),
	CONSTRAINT trip_expenses_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id)
);
CREATE INDEX IF NOT EXISTS idx_trip_expenses_trip ON public.trip_expenses USING btree (trip_id);

-- 17. Delivery Challans
CREATE TABLE IF NOT EXISTS public.delivery_challans (
	id bigserial NOT NULL,
	challan_no varchar(50) NOT NULL,
	challan_date date NOT NULL,
	order_id int8 NULL,
	deal_id int8 NULL,
	customer_id int8 NULL,
	product_id int8 NULL,
	qty numeric(10, 2) NULL,
	hsn_code varchar(8) NULL,
	gst_rate numeric(5, 2) NULL,
	amount numeric(15, 2) NULL,
	status varchar(30) DEFAULT 'Draft'::character varying NULL,
	cancelled bool DEFAULT false NULL,
	cancel_remark text NULL,
	cancelled_at timestamp NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT delivery_challans_challan_no_key UNIQUE (challan_no),
	CONSTRAINT delivery_challans_pkey PRIMARY KEY (id),
	CONSTRAINT delivery_challans_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
	CONSTRAINT delivery_challans_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
	CONSTRAINT delivery_challans_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE INDEX IF NOT EXISTS idx_challan_no ON public.delivery_challans USING btree (challan_no);

-- 18. Deals
CREATE TABLE IF NOT EXISTS public.deals (
	id bigserial NOT NULL,
	deal_no varchar(50) NOT NULL,
	customer_id int8 NULL,
	supplier_id int8 NULL,
	order_id int8 NULL,
	challan_id int8 NULL,
	weigh_slip_id int8 NULL,
	trip_id int8 NULL,
	sales_invoice_id int8 NULL,
	purchase_invoice_id int8 NULL,
	deal_date date NULL,
	total_value numeric(15, 2) NULL,
	status varchar(30) DEFAULT 'Created'::character varying NULL,
	cancelled bool DEFAULT false NULL,
	cancel_remark text NULL,
	cancelled_at timestamp NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT deals_deal_no_key UNIQUE (deal_no),
	CONSTRAINT deals_pkey PRIMARY KEY (id),
	CONSTRAINT deals_challan_id_fkey FOREIGN KEY (challan_id) REFERENCES public.delivery_challans(id),
	CONSTRAINT deals_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
	CONSTRAINT deals_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
	CONSTRAINT deals_purchase_invoice_id_fkey FOREIGN KEY (purchase_invoice_id) REFERENCES public.purchase_invoices(id),
	CONSTRAINT deals_sales_invoice_id_fkey FOREIGN KEY (sales_invoice_id) REFERENCES public.sales_invoices(id),
	CONSTRAINT deals_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
	CONSTRAINT deals_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
	CONSTRAINT deals_weigh_slip_id_fkey FOREIGN KEY (weigh_slip_id) REFERENCES public.weigh_slips(id)
);
CREATE INDEX IF NOT EXISTS idx_deal_no ON public.deals USING btree (deal_no);

-- 19. Payments (New table with bigserial ID)
CREATE TABLE IF NOT EXISTS public.payments (
	id bigserial NOT NULL,
	payment_no varchar(50) NOT NULL,
	payment_date date NOT NULL,
	party_name varchar(255) NOT NULL,
	party_type varchar(50) NOT NULL,
	amount numeric(15, 2) NOT NULL,
	payment_mode varchar(20) NOT NULL,
	reference varchar(100) NULL,
	notes text NULL,
	payment_direction varchar(10) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT payments_payment_no_key UNIQUE (payment_no),
	CONSTRAINT payments_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_payment_no ON public.payments USING btree (payment_no);
CREATE INDEX IF NOT EXISTS idx_payment_party ON public.payments USING btree (party_name, party_type);

-- 20. Expenses (New table with bigserial ID and int8 FKs)
CREATE TABLE IF NOT EXISTS public.expenses (
	id bigserial NOT NULL,
	expense_no varchar(50) NOT NULL,
	expense_date date NOT NULL,
	category varchar(100) NOT NULL,
	vehicle_id int8 NULL,
	driver_id int8 NULL,
	paid_to varchar(255) NOT NULL,
	payment_mode varchar(20) NOT NULL,
	amount numeric(15, 2) NOT NULL,
	remarks text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT expenses_expense_no_key UNIQUE (expense_no),
	CONSTRAINT expenses_pkey PRIMARY KEY (id),
	CONSTRAINT expenses_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id),
	CONSTRAINT expenses_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE INDEX IF NOT EXISTS idx_expense_no ON public.expenses USING btree (expense_no);
CREATE INDEX IF NOT EXISTS idx_expense_category ON public.expenses USING btree (category);

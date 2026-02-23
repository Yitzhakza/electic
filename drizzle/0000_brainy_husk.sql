CREATE TABLE "accessory_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name_he" varchar(128) NOT NULL,
	"name_en" varchar(128) NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "accessory_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name_he" varchar(128) NOT NULL,
	"name_en" varchar(128) NOT NULL,
	"logo_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"title_he_override" text,
	"description_he_override" text,
	"coupon_override" varchar(64),
	"tags_override" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"aliexpress_product_id" varchar(64) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title_original" text NOT NULL,
	"title_he" text,
	"description_he" text,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price" real NOT NULL,
	"currency" varchar(8) DEFAULT 'USD' NOT NULL,
	"original_price" real,
	"rating" real,
	"total_orders" integer DEFAULT 0 NOT NULL,
	"shipping_info" text,
	"original_url" text NOT NULL,
	"affiliate_url" text,
	"coupon_code" varchar(64),
	"brand_id" integer,
	"category_id" integer,
	"brand_hints" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category_hints" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "search_queries" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand_id" integer NOT NULL,
	"category_id" integer,
	"query_text" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"last_sync_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sync_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"sync_run_id" integer NOT NULL,
	"query_id" integer,
	"level" varchar(8) DEFAULT 'info' NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"status" varchar(16) DEFAULT 'running' NOT NULL,
	"total_queries" integer DEFAULT 0 NOT NULL,
	"total_products" integer DEFAULT 0 NOT NULL,
	"new_products" integer DEFAULT 0 NOT NULL,
	"updated_products" integer DEFAULT 0 NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"triggered_by" varchar(16) DEFAULT 'cron' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_overrides" ADD CONSTRAINT "product_overrides_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_accessory_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."accessory_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_queries" ADD CONSTRAINT "search_queries_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_queries" ADD CONSTRAINT "search_queries_category_id_accessory_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."accessory_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_sync_run_id_sync_runs_id_fk" FOREIGN KEY ("sync_run_id") REFERENCES "public"."sync_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_query_id_search_queries_id_fk" FOREIGN KEY ("query_id") REFERENCES "public"."search_queries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_overrides_product" ON "product_overrides" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_products_aliexpress_id" ON "products" USING btree ("aliexpress_product_id");--> statement-breakpoint
CREATE INDEX "idx_products_brand" ON "products" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "idx_products_category" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_products_active" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_search_queries_brand" ON "search_queries" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "idx_sync_logs_run" ON "sync_logs" USING btree ("sync_run_id");
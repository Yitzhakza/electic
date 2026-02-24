CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(32),
	"car_model" varchar(128),
	"source" varchar(64) DEFAULT 'website' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"promo_name" varchar(128) NOT NULL,
	"promo_name_he" varchar(128),
	"coupon_code" varchar(64),
	"discount_value" varchar(32),
	"min_spend" varchar(32),
	"start_date" timestamp,
	"end_date" timestamp,
	"promotion_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_sync_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "coupon_discount" varchar(32);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "coupon_min_spend" varchar(32);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "coupon_expiry" timestamp;--> statement-breakpoint
CREATE INDEX "idx_leads_email" ON "leads" USING btree ("email");
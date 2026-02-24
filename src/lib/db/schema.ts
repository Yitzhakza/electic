import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  real,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ── Brands ──────────────────────────────────────────────────────────
export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  nameHe: varchar('name_he', { length: 128 }).notNull(),
  nameEn: varchar('name_en', { length: 128 }).notNull(),
  logoUrl: text('logo_url'),
  displayOrder: integer('display_order').notNull().default(0),
  enabled: boolean('enabled').notNull().default(true),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
  searchQueries: many(searchQueries),
}));

// ── Accessory Categories ────────────────────────────────────────────
export const accessoryCategories = pgTable('accessory_categories', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  nameHe: varchar('name_he', { length: 128 }).notNull(),
  nameEn: varchar('name_en', { length: 128 }).notNull(),
  keywords: jsonb('keywords').$type<string[]>().notNull().default([]),
  displayOrder: integer('display_order').notNull().default(0),
  enabled: boolean('enabled').notNull().default(true),
});

export const accessoryCategoriesRelations = relations(accessoryCategories, ({ many }) => ({
  products: many(products),
  searchQueries: many(searchQueries),
}));

// ── Search Queries ──────────────────────────────────────────────────
export const searchQueries = pgTable(
  'search_queries',
  {
    id: serial('id').primaryKey(),
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id').references(() => accessoryCategories.id, { onDelete: 'set null' }),
    queryText: text('query_text').notNull(),
    enabled: boolean('enabled').notNull().default(true),
    lastSyncAt: timestamp('last_sync_at'),
  },
  (table) => [index('idx_search_queries_brand').on(table.brandId)]
);

export const searchQueriesRelations = relations(searchQueries, ({ one }) => ({
  brand: one(brands, { fields: [searchQueries.brandId], references: [brands.id] }),
  category: one(accessoryCategories, {
    fields: [searchQueries.categoryId],
    references: [accessoryCategories.id],
  }),
}));

// ── Products ────────────────────────────────────────────────────────
export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    aliexpressProductId: varchar('aliexpress_product_id', { length: 64 }).notNull(),
    slug: varchar('slug', { length: 256 }).notNull().unique(),
    titleOriginal: text('title_original').notNull(),
    titleHe: text('title_he'),
    descriptionHe: text('description_he'),
    images: jsonb('images').$type<string[]>().notNull().default([]),
    price: real('price').notNull(),
    currency: varchar('currency', { length: 8 }).notNull().default('USD'),
    originalPrice: real('original_price'),
    rating: real('rating'),
    totalOrders: integer('total_orders').notNull().default(0),
    shippingInfo: text('shipping_info'),
    originalUrl: text('original_url').notNull(),
    affiliateUrl: text('affiliate_url'),
    couponCode: varchar('coupon_code', { length: 64 }),
    couponDiscount: varchar('coupon_discount', { length: 32 }),
    couponMinSpend: varchar('coupon_min_spend', { length: 32 }),
    couponExpiry: timestamp('coupon_expiry'),
    brandId: integer('brand_id').references(() => brands.id, { onDelete: 'set null' }),
    categoryId: integer('category_id').references(() => accessoryCategories.id, { onDelete: 'set null' }),
    brandHints: jsonb('brand_hints').$type<string[]>().notNull().default([]),
    categoryHints: jsonb('category_hints').$type<string[]>().notNull().default([]),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('idx_products_aliexpress_id').on(table.aliexpressProductId),
    index('idx_products_brand').on(table.brandId),
    index('idx_products_category').on(table.categoryId),
    index('idx_products_active').on(table.isActive),
  ]
);

export const productsRelations = relations(products, ({ one }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  category: one(accessoryCategories, { fields: [products.categoryId], references: [accessoryCategories.id] }),
  override: one(productOverrides),
}));

// ── Product Overrides ───────────────────────────────────────────────
export const productOverrides = pgTable(
  'product_overrides',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    titleHeOverride: text('title_he_override'),
    descriptionHeOverride: text('description_he_override'),
    couponOverride: varchar('coupon_override', { length: 64 }),
    tagsOverride: jsonb('tags_override').$type<string[]>().notNull().default([]),
    isHidden: boolean('is_hidden').notNull().default(false),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('idx_overrides_product').on(table.productId)]
);

export const productOverridesRelations = relations(productOverrides, ({ one }) => ({
  product: one(products, { fields: [productOverrides.productId], references: [products.id] }),
}));

// ── Platform Coupons ────────────────────────────────────────────────
export const platformCoupons = pgTable('platform_coupons', {
  id: serial('id').primaryKey(),
  promoName: varchar('promo_name', { length: 128 }).notNull(),
  promoNameHe: varchar('promo_name_he', { length: 128 }),
  couponCode: varchar('coupon_code', { length: 64 }),
  discountValue: varchar('discount_value', { length: 32 }),
  minSpend: varchar('min_spend', { length: 32 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  promotionUrl: text('promotion_url'),
  isActive: boolean('is_active').notNull().default(true),
  lastSyncAt: timestamp('last_sync_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Sync Runs ───────────────────────────────────────────────────────
export const syncRuns = pgTable('sync_runs', {
  id: serial('id').primaryKey(),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  status: varchar('status', { length: 16 }).notNull().default('running'),
  totalQueries: integer('total_queries').notNull().default(0),
  totalProducts: integer('total_products').notNull().default(0),
  newProducts: integer('new_products').notNull().default(0),
  updatedProducts: integer('updated_products').notNull().default(0),
  errors: jsonb('errors').$type<string[]>().notNull().default([]),
  triggeredBy: varchar('triggered_by', { length: 16 }).notNull().default('cron'),
});

// ── Sync Logs ───────────────────────────────────────────────────────
export const syncLogs = pgTable(
  'sync_logs',
  {
    id: serial('id').primaryKey(),
    syncRunId: integer('sync_run_id')
      .notNull()
      .references(() => syncRuns.id, { onDelete: 'cascade' }),
    queryId: integer('query_id').references(() => searchQueries.id, { onDelete: 'set null' }),
    level: varchar('level', { length: 8 }).notNull().default('info'),
    message: text('message').notNull(),
    data: jsonb('data').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('idx_sync_logs_run').on(table.syncRunId)]
);

export const syncLogsRelations = relations(syncLogs, ({ one }) => ({
  syncRun: one(syncRuns, { fields: [syncLogs.syncRunId], references: [syncRuns.id] }),
  query: one(searchQueries, { fields: [syncLogs.queryId], references: [searchQueries.id] }),
}));

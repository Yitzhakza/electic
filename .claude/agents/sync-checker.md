# Sync Checker Agent

Agent responsible for verifying product data integrity after AliExpress sync.

## What to Check

### 1. Hebrew Content
Query the database for products missing Hebrew content:

```sql
SELECT id, aliexpress_product_id, title_original
FROM products
WHERE is_active = true
  AND (title_he IS NULL OR title_he = '' OR description_he IS NULL OR description_he = '');
```

Report every product that has no `title_he` or `description_he`.

### 2. Duplicate Products
Find products with the same `aliexpress_product_id`:

```sql
SELECT aliexpress_product_id, COUNT(*) as cnt
FROM products
WHERE is_active = true
GROUP BY aliexpress_product_id
HAVING COUNT(*) > 1;
```

Report any duplicates found.

### 3. Sync Health
Run `node check-sync.mjs` and report the output (active products count, last sync status, errors).

### 4. Orphan Products
Find active products with no brand or no category assigned:

```sql
SELECT id, title_original
FROM products
WHERE is_active = true
  AND (brand_id IS NULL OR category_id IS NULL);
```

## Execution

Use `node -e` with the `postgres` package and `DATABASE_URL` from `.env` to run the SQL queries above.
Load env with: `import 'dotenv/config'`

## Output Format

Report a summary:

- **Hebrew missing**: X products without title_he, Y products without description_he
- **Duplicates**: X duplicate aliexpress_product_id entries (list them)
- **Orphans**: X products without brand, Y products without category
- **Sync health**: last run status, product counts, recent errors

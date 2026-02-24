import postgres from 'postgres';

const sql = postgres('postgresql://postgres.nlgvnlrvzzwowvsjfpdz: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@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres', { prepare: false });

async function run() {
  // Add coupon metadata columns to products
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS coupon_discount varchar(32)`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS coupon_min_spend varchar(32)`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS coupon_expiry timestamp`;
  console.log('Added coupon columns to products');

  // Create platform_coupons table
  await sql`
    CREATE TABLE IF NOT EXISTS platform_coupons (
      id serial PRIMARY KEY,
      promo_name varchar(128) NOT NULL,
      promo_name_he varchar(128),
      coupon_code varchar(64),
      discount_value varchar(32),
      min_spend varchar(32),
      start_date timestamp,
      end_date timestamp,
      promotion_url text,
      is_active boolean NOT NULL DEFAULT true,
      last_sync_at timestamp NOT NULL DEFAULT now(),
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('Created platform_coupons table');

  await sql.end();
  console.log('Done!');
}

run().catch(e => { console.error(e); process.exit(1); });

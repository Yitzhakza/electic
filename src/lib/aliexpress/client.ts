import { AliExpressApiError, type AliProduct, type AffiliateLink, type SearchParams, type FeaturedPromotion } from './types';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const RATE_LIMIT_DELAY_MS = 2000;
const BASE_URL = 'https://api-sg.aliexpress.com/sync';

interface AliExpressClientConfig {
  appKey: string;
  appSecret: string;
  trackingId: string;
}

export class AliExpressClient {
  private config: AliExpressClientConfig;
  private lastRequestTime = 0;

  constructor(config?: Partial<AliExpressClientConfig>) {
    this.config = {
      appKey: config?.appKey ?? process.env.ALIEXPRESS_APP_KEY ?? '',
      appSecret: config?.appSecret ?? process.env.ALIEXPRESS_APP_SECRET ?? '',
      trackingId: config?.trackingId ?? process.env.ALIEXPRESS_TRACKING_ID ?? '',
    };
  }

  async searchProducts(params: SearchParams): Promise<AliProduct[]> {
    const body: Record<string, string> = {
      keywords: params.keywords,
      page_no: String(params.pageNo ?? 1),
      page_size: String(params.pageSize ?? 20),
      sort: params.sort ?? 'LAST_VOLUME_DESC',
      ship_to_country: params.shipToCountry ?? 'IL',
      target_currency: 'USD',
      target_language: 'EN',
      tracking_id: this.config.trackingId,
    };
    if (params.minPrice) body.min_sale_price = String(params.minPrice);
    if (params.maxPrice) body.max_sale_price = String(params.maxPrice);

    const data = await this.makeRequest('aliexpress.affiliate.product.query', body);
    const resp = data?.aliexpress_affiliate_product_query_response;
    const products =
      resp?.resp_result?.result?.products?.product ??
      resp?.resp_result?.result?.products ??
      [];
    return products as AliProduct[];
  }

  async getProductDetail(productId: string): Promise<AliProduct | null> {
    const body: Record<string, string> = {
      product_ids: productId,
      tracking_id: this.config.trackingId,
      target_currency: 'USD',
      target_language: 'EN',
      ship_to_country: 'IL',
    };

    const data = await this.makeRequest('aliexpress.affiliate.productdetail.get', body);
    const resp = data?.aliexpress_affiliate_productdetail_get_response;
    const products =
      resp?.resp_result?.result?.products?.product ??
      resp?.resp_result?.result?.products ??
      [];
    return (products[0] as AliProduct) ?? null;
  }

  async generateAffiliateLink(originalUrl: string): Promise<AffiliateLink | null> {
    const body: Record<string, string> = {
      promotion_link_type: '0',
      source_values: originalUrl,
      tracking_id: this.config.trackingId,
    };

    const data = await this.makeRequest('aliexpress.affiliate.link.generate', body);
    const resp = data?.aliexpress_affiliate_link_generate_response;
    const links =
      resp?.resp_result?.result?.promotion_links?.promotion_link ??
      resp?.resp_result?.result?.promotion_links ??
      [];
    if (links.length > 0) {
      return { promotionUrl: links[0].promotion_link ?? '' } as AffiliateLink;
    }
    return null;
  }

  async getProductCoupons(productId: string): Promise<string | null> {
    try {
      const body: Record<string, string> = {
        product_id: productId,
        tracking_id: this.config.trackingId,
      };

      const data = await this.makeRequest('aliexpress.affiliate.featuredpromo.get', body);
      const resp = data?.aliexpress_affiliate_featuredpromo_get_response;
      const promos = resp?.resp_result?.result?.promos?.promo ?? [];
      if (promos.length > 0) {
        return promos[0].promo_code ?? null;
      }
    } catch {
      // Coupon/promo endpoint may fail - silently ignore
    }
    return null;
  }

  async getFeaturedPromotions(): Promise<FeaturedPromotion[]> {
    try {
      const body: Record<string, string> = {
        tracking_id: this.config.trackingId,
      };

      const data = await this.makeRequest('aliexpress.affiliate.featuredpromo.get', body);
      const resp = data?.aliexpress_affiliate_featuredpromo_get_response;
      const promos =
        resp?.resp_result?.result?.promos?.promo ??
        resp?.resp_result?.result?.promos ??
        [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return promos.map((p: any) => ({
        promotionName: p.promo_name ?? '',
        promotionDesc: p.promo_desc ?? '',
        productCount: Number(p.product_num ?? 0),
      }));
    } catch {
      return [];
    }
  }

  async getPromotionProducts(promotionName: string, pageNo = 1): Promise<AliProduct[]> {
    const body: Record<string, string> = {
      promotion_name: promotionName,
      tracking_id: this.config.trackingId,
      page_no: String(pageNo),
      page_size: '50',
      target_currency: 'USD',
      target_language: 'EN',
      ship_to_country: 'IL',
    };

    const data = await this.makeRequest('aliexpress.affiliate.featuredpromo.products.get', body);
    const resp = data?.aliexpress_affiliate_featuredpromo_products_get_response;
    const products =
      resp?.resp_result?.result?.products?.product ??
      resp?.resp_result?.result?.products ??
      [];
    return products as AliProduct[];
  }

  // ── Internal request handler with retry + throttle ──────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async makeRequest(method: string, params: Record<string, string>): Promise<any> {
    await this.throttle();

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const systemParams: Record<string, string> = {
          method,
          app_key: this.config.appKey,
          sign_method: 'hmac-sha256',
          timestamp: this.getTimestamp(),
          format: 'json',
          v: '2.0',
        };

        const allParams = { ...systemParams, ...params };
        const sign = await this.computeSign(allParams);
        allParams.sign = sign;

        // AliExpress API expects URL-encoded form data
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(allParams)) {
          urlParams.append(key, value);
        }

        const response = await fetch(BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          body: urlParams.toString(),
        });

        this.lastRequestTime = Date.now();

        if (!response.ok) {
          throw new AliExpressApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
        }

        const json = await response.json();

        if (json.error_response) {
          throw new AliExpressApiError(
            json.error_response.msg ?? json.error_response.sub_msg ?? 'Unknown API error',
            undefined,
            json.error_response.code?.toString()
          );
        }

        return json as Record<string, unknown>;
      } catch (error) {
        lastError = error as Error;

        if (error instanceof AliExpressApiError && error.statusCode === 429) {
          await this.sleep(RATE_LIMIT_DELAY_MS * (attempt + 1));
          continue;
        }

        if (attempt < MAX_RETRIES - 1) {
          await this.sleep(BASE_DELAY_MS * Math.pow(2, attempt));
          continue;
        }
      }
    }

    throw lastError ?? new AliExpressApiError('All retry attempts failed');
  }

  /**
   * Generate GMT+8 timestamp in yyyy-MM-dd HH:mm:ss format.
   */
  private getTimestamp(): string {
    const now = new Date();
    // Convert to GMT+8
    const gmt8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const y = gmt8.getUTCFullYear();
    const m = String(gmt8.getUTCMonth() + 1).padStart(2, '0');
    const d = String(gmt8.getUTCDate()).padStart(2, '0');
    const h = String(gmt8.getUTCHours()).padStart(2, '0');
    const min = String(gmt8.getUTCMinutes()).padStart(2, '0');
    const s = String(gmt8.getUTCSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  }

  /**
   * HMAC-SHA256 signing per AliExpress Open Platform spec.
   * Sort params alphabetically, concatenate key+value pairs, HMAC with appSecret.
   */
  private async computeSign(params: Record<string, string>): Promise<string> {
    const sortedKeys = Object.keys(params)
      .filter((k) => k !== 'sign')
      .sort();
    const signStr = sortedKeys.map((k) => `${k}${params[k]}`).join('');

    // Use Node.js crypto (available in Next.js server context)
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', this.config.appSecret)
      .update(signStr)
      .digest('hex')
      .toUpperCase();
  }

  private async throttle(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestTime;
    if (elapsed < RATE_LIMIT_DELAY_MS) {
      await this.sleep(RATE_LIMIT_DELAY_MS - elapsed);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
let clientInstance: AliExpressClient | null = null;

export function getAliExpressClient(): AliExpressClient {
  if (!clientInstance) {
    clientInstance = new AliExpressClient();
  }
  return clientInstance;
}

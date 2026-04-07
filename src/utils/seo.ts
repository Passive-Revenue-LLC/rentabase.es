/** Utilidades SEO para generar meta tags */

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedDate?: string;
  modifiedDate?: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
}

const SITE_URL = 'https://rentabase.es';
const DEFAULT_IMAGE = '/og-default.png';
const LOGO_IMAGE = '/og-default.png';
const SITE_NAME = 'RentaBase';
const SITE_DESCRIPTION =
  'Blog sobre inversión, ahorro, criptomonedas y fiscalidad en España';

/** Asegura trailing slash en las URLs para consistencia con el sitemap */
function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

/** Genera todos los meta tags SEO necesarios */
export function generateSEO({
  title,
  description,
  image,
  url = '',
  type = 'website',
}: SEOProps): SEOMeta {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const canonicalURL = ensureTrailingSlash(new URL(url, SITE_URL).href);
  const ogImage = image ? new URL(image, SITE_URL).href : new URL(DEFAULT_IMAGE, SITE_URL).href;

  return {
    title: fullTitle,
    description,
    canonical: canonicalURL,
    openGraph: {
      title: fullTitle,
      description,
      image: ogImage,
      url: canonicalURL,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      image: ogImage,
    },
  };
}

/** Genera JSON-LD para un artículo (BlogPosting) */
export function generateArticleJsonLd({
  title,
  description,
  image,
  url,
  publishedDate,
  modifiedDate,
}: SEOProps) {
  const canonicalURL = ensureTrailingSlash(new URL(url ?? '', SITE_URL).href);
  const imageURL = image
    ? new URL(image, SITE_URL).href
    : new URL(DEFAULT_IMAGE, SITE_URL).href;
  const logoURL = new URL(LOGO_IMAGE, SITE_URL).href;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: imageURL,
    url: canonicalURL,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalURL,
    },
    datePublished: publishedDate,
    dateModified: modifiedDate ?? publishedDate,
    inLanguage: 'es-ES',
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: logoURL,
      },
    },
  };
}

/** Genera JSON-LD para breadcrumbs */
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: ensureTrailingSlash(new URL(item.url, SITE_URL).href),
    })),
  };
}

/** Genera JSON-LD para el sitio web */
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'es-ES',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: new URL(LOGO_IMAGE, SITE_URL).href,
      },
    },
  };
}

/** Genera JSON-LD Organization (identidad de marca para LLMs y rich results) */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      '@type': 'ImageObject',
      url: new URL(LOGO_IMAGE, SITE_URL).href,
    },
    sameAs: [],
  };
}

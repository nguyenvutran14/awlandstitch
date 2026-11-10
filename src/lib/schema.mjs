function compact(value) {
  if (Array.isArray(value)) {
    return value.map(compact).filter((item) => item !== undefined && item !== null);
  }
  if (value && typeof value === 'object') {
    const output = {};
    for (const [key, item] of Object.entries(value)) {
      if (item === undefined || item === null) continue;
      const cleaned = compact(item);
      if (cleaned === undefined || cleaned === null) continue;
      output[key] = cleaned;
    }
    return output;
  }
  return value;
}

function absolute(siteUrl, pathname) {
  return new URL(pathname, `${siteUrl}/`).href;
}

function breadcrumbNode(page, siteUrl) {
  if (!page.breadcrumb?.length) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${page.canonical}#breadcrumb`,
    itemListElement: page.breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(siteUrl, item.path)
    }))
  };
}

function organizationNode(site, siteUrl) {
  return {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: site.brand,
    url: `${siteUrl}/`,
    description: site.description,
    email: site.email,
    logo: {
      '@type': 'ImageObject',
      url: absolute(siteUrl, '/logo-512.png'),
      width: 512,
      height: 512
    }
  };
}

function websiteNode(site, siteUrl) {
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: site.brand,
    url: `${siteUrl}/`,
    description: site.description,
    inLanguage: site.locale,
    publisher: { '@id': `${siteUrl}/#organization` }
  };
}

function webPageNode(page, site, siteUrl) {
  return {
    '@type': 'WebPage',
    '@id': `${page.canonical}#webpage`,
    url: page.canonical,
    name: page.metaTitle,
    description: page.metaDescription,
    dateModified: page.dateModified,
    isPartOf: { '@id': `${siteUrl}/#website` },
    inLanguage: site.locale,
    breadcrumb: { '@id': `${page.canonical}#breadcrumb` },
    primaryImageOfPage: page.ogImage
      ? { '@type': 'ImageObject', url: absolute(siteUrl, page.ogImage) }
      : undefined
  };
}

function blogPostingNode(page, site, siteUrl) {
  return {
    '@type': 'BlogPosting',
    '@id': `${page.canonical}#article`,
    headline: page.title,
    name: page.metaTitle,
    description: page.metaDescription,
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    author: {
      '@type': 'Person',
      name: page.author,
      description: page.authorBio,
      url: absolute(siteUrl, '/about/')
    },
    publisher: { '@id': `${siteUrl}/#organization` },
    image: [absolute(siteUrl, page.ogImage)],
    mainEntityOfPage: { '@type': 'WebPage', '@id': page.canonical },
    isPartOf: { '@id': `${siteUrl}/#website` },
    inLanguage: site.locale,
    articleSection: page.category,
    keywords: page.primaryKeyword,
    url: page.canonical,
    wordCount: page.wordCount
  };
}

function faqNode(page, site) {
  if (!page.faq?.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${page.canonical}#faq`,
    url: page.canonical,
    inLanguage: site.locale,
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };
}

function productId(siteUrl, product) {
  return `${siteUrl}/#product-${product.listingId}`;
}

function productNode(product, siteUrl) {
  const offer = {
    '@type': 'Offer',
    url: product.url,
    priceCurrency: product.currency || 'USD',
    price: Number(product.price),
    description: product.priceNote
  };

  if (product.priceApprox) {
    offer.priceSpecification = {
      '@type': 'PriceSpecification',
      priceCurrency: product.currency || 'USD',
      minPrice: Number((product.price * 0.9).toFixed(2)),
      maxPrice: Number((product.price * 1.1).toFixed(2))
    };
  }

  const node = {
    '@type': 'Product',
    '@id': productId(siteUrl, product),
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    sku: product.listingId,
    description: [product.priceNote, product.needsVerificationNote].filter(Boolean).join(' '),
    url: product.url,
    offers: offer,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Price checked', value: product.asOf },
      {
        '@type': 'PropertyValue',
        name: 'Verification status',
        value: product.needsVerification ? 'Needs verification' : 'Verified in our check'
      }
    ]
  };

  if (product.ratingVerified && product.rating != null && product.reviewCount != null) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.rating),
      reviewCount: Number(product.reviewCount),
      bestRating: 5,
      worstRating: 1
    };
  }

  return node;
}

function itemListNode(page, products, siteUrl) {
  return {
    '@type': 'ItemList',
    '@id': `${page.canonical}#itemlist`,
    name: `${page.title} — ranked picks`,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: product.url,
      item: { '@id': productId(siteUrl, product) }
    }))
  };
}

function collectionPageNode(page, site, siteUrl) {
  return {
    '@type': 'CollectionPage',
    '@id': `${page.canonical}#webpage`,
    url: page.canonical,
    name: page.title,
    description: page.metaDescription,
    dateModified: page.dateModified,
    isPartOf: { '@id': `${siteUrl}/#website` },
    inLanguage: site.locale,
    breadcrumb: { '@id': `${page.canonical}#breadcrumb` },
    hasPart: page.articles.map((article) => ({
      '@type': 'BlogPosting',
      '@id': `${article.canonical}#article`,
      headline: article.title,
      url: article.canonical,
      datePublished: article.datePublished
    }))
  };
}

export function buildSchemaGraph(page, context) {
  const { site, siteUrl, affiliates } = context;
  const nodes = [];
  const breadcrumb = breadcrumbNode(page, siteUrl);
  if (breadcrumb) nodes.push(breadcrumb);

  if (page.type === 'home') {
    nodes.push(organizationNode(site, siteUrl));
    nodes.push(websiteNode(site, siteUrl));
    nodes.push(webPageNode(page, site, siteUrl));
  }

  if (page.type === 'article') {
    nodes.push(blogPostingNode(page, site, siteUrl));

    if (page.schemaTypes.includes('FAQPage')) {
      const faq = faqNode(page, site);
      if (faq) nodes.push(faq);
    }

    const productSlugs = affiliates.itemLists?.[page.slug] || [];
    const products = productSlugs
      .map((slug) => affiliates.products?.[slug])
      .filter(Boolean);

    if (page.schemaTypes.includes('Product') && products.length) {
      const seen = new Set();
      for (const product of products) {
        const id = productId(siteUrl, product);
        if (seen.has(id)) continue;
        seen.add(id);
        nodes.push(productNode(product, siteUrl));
      }
    }

    if (page.schemaTypes.includes('ItemList') && products.length) {
      nodes.push(itemListNode(page, products, siteUrl));
    }
  }

  if (page.type === 'trust') {
    nodes.push(webPageNode(page, site, siteUrl));
  }

  if (page.type === 'all-articles') {
    nodes.push(collectionPageNode(page, site, siteUrl));
  }

  return compact({
    '@context': 'https://schema.org',
    '@graph': nodes
  });
}

export function schemaTypesForPage(page) {
  if (page.type === 'home') return ['WebSite', 'Organization', 'WebPage', 'BreadcrumbList'];
  if (page.type === 'article') {
    return ['BlogPosting', ...(page.schemaTypes.includes('FAQPage') && page.faq.length ? ['FAQPage'] : []), ...(page.schemaTypes.includes('ItemList') ? ['ItemList'] : []), ...(page.schemaTypes.includes('Product') ? ['Product'] : []), 'BreadcrumbList'];
  }
  if (page.type === 'trust') return ['WebPage', 'BreadcrumbList'];
  if (page.type === 'all-articles') return ['CollectionPage', 'BreadcrumbList'];
  return [];
}

import MarkdownIt from 'markdown-it';
import { escapeAttr, slugify, stripHtml } from './util.mjs';

const EMOJI_OR_SPACE = /[\u{1F000}-\u{1FAFF}\u2600-\u27BF\s]/gu;

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value || '');
}

function isAliExpressHost(hostname) {
  return /(^|\.)aliexpress\.us$/i.test(hostname || '');
}

function itemIdFromUrl(value) {
  try {
    const url = new URL(value);
    const match = url.pathname.match(/\/item\/([^/]+?)(?:\.html)?$/i);
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

function buildAffiliateHref(url, env) {
  const meta = env.affiliates?._meta || {};
  const parsed = new URL(url);
  const trackingId = String(meta.trackingId || '').trim();
  if (trackingId && !/YOUR-|PLACEHOLDER|EXAMPLE/i.test(trackingId)) {
    parsed.searchParams.set(meta.trackingParam || 'aff_trace_key', trackingId);
  }
  return parsed.href;
}

function productHref(product, affiliates) {
  return buildAffiliateHref(product.url, { affiliates });
}

function validProductUrl(product) {
  return Boolean(product && isHttpUrl(product.url) && !/PLACEHOLDER|YOUR-/i.test(product.url));
}

export function expandAffiliateTokens(markdown, affiliates) {
  const warnings = [];
  const products = affiliates.products || {};
  let output = String(markdown);

  output = output.replace(
    /\[([^\]]+)\]\(\{\{aff:([a-z0-9-]+)\}\}\)/g,
    (match, label, slug) => {
      const product = products[slug];
      if (!validProductUrl(product)) {
        warnings.push(`Affiliate token ${slug} has no usable URL; rendered as pending text.`);
        return `${label} <span class="aff-pending-inline" data-affiliate-pending="true">(affiliate link pending)</span>`;
      }
      return `[${label}](${productHref(product, affiliates)})`;
    }
  );

  output = output.replace(/^[ \t]*\{\{aff:([a-z0-9-]+)\}\}[ \t]*$/gm, (match, slug) => {
    const product = products[slug];
    if (!validProductUrl(product)) {
      warnings.push(`Affiliate token ${slug} has no usable URL; rendered as a disabled CTA.`);
      return '\n<div class="aff-cta-wrap"><span class="affiliate-cta is-disabled" data-affiliate-pending="true" aria-disabled="true">Affiliate link pending</span></div>\n';
    }
    const href = productHref(product, affiliates);
    return `\n<div class="aff-cta-wrap"><a class="affiliate-cta" href="${escapeAttr(href)}" target="_blank" rel="sponsored nofollow noopener">Check current price on AliExpress<span class="visually-hidden"> (affiliate link, opens in a new tab)</span></a></div>\n`;
  });

  if (/\{\{aff:[^}]+\}\}/.test(output)) {
    warnings.push('Unresolved affiliate token remained after expansion; replaced with a disabled placeholder.');
    output = output.replace(
      /\{\{aff:[^}]+\}\}/g,
      '<span class="aff-pending-inline" data-affiliate-pending="true">(affiliate link pending)</span>'
    );
  }

  return { markdown: output, warnings };
}

export function stripComments(markdown) {
  const comments = [];
  const cleaned = String(markdown).replace(/<!--([\s\S]*?)-->/g, (match, inner) => {
    comments.push(inner.trim());
    return '';
  });
  return { markdown: cleaned, comments };
}

function inlineText(token) {
  if (!token) return '';
  if (Array.isArray(token.children)) {
    return token.children
      .filter((child) => child.type === 'text' || child.type === 'code_inline' || child.type === 'html_inline')
      .map((child) => child.content)
      .join('');
  }
  return token.content || '';
}

function normalizeCtaText(value) {
  return String(value || '').replace(EMOJI_OR_SPACE, '').toLowerCase();
}

function prepareHeadings(tokens) {
  const firstH1 = tokens.findIndex(
    (token, index) =>
      token.type === 'heading_open' &&
      token.tag === 'h1' &&
      tokens[index + 1]?.type === 'inline' &&
      tokens[index + 2]?.type === 'heading_close'
  );
  if (firstH1 !== -1) {
    tokens.splice(firstH1, 3);
  }

  const seen = new Map();
  const headings = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type !== 'heading_open') continue;

    const level = Number(token.tag.slice(1));
    const text = inlineText(tokens[index + 1]).replace(/\s+/g, ' ').trim();
    const base = slugify(text);
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;

    token.attrSet('id', id);
    token.meta = token.meta || {};
    if (text.toLowerCase() === 'sources') token.meta.sources = true;
    if (text.toLowerCase() === 'faq') token.meta.faq = true;

    headings.push({ level, text, id });
  }

  return headings;
}

function extractHero(tokens, heroImage) {
  if (!heroImage) return null;

  // markdown-it parses markdown images as inline children of 'inline' tokens,
  // so search inline children (not top-level tokens) for the hero image.
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type !== 'inline' || !Array.isArray(token.children)) continue;

    const childIndex = token.children.findIndex(
      (child) => child.type === 'image' && child.attrGet('src') === heroImage
    );
    if (childIndex === -1) continue;

    const child = token.children[childIndex];
    const hero = {
      src: child.attrGet('src') || heroImage,
      alt: child.content || '',
      title: child.attrGet('title') || ''
    };

    const hasVisibleContent = token.children.some(
      (other, position) =>
        position !== childIndex &&
        other.type !== 'text' &&
        other.type !== 'softbreak' &&
        other.type !== 'hardbreak'
    );
    const hasText = token.children.some(
      (other, position) => position !== childIndex && other.type === 'text' && other.content.trim() !== ''
    );

    if (!hasVisibleContent && !hasText && tokens[index - 1]?.type === 'paragraph_open' && tokens[index + 1]?.type === 'paragraph_close') {
      tokens.splice(index - 1, 3);
    } else {
      token.children.splice(childIndex, 1);
    }

    return hero;
  }

  return null;
}

function markDisclosures(tokens) {
  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index].type !== 'blockquote_open') continue;

    let depth = 0;
    let end = index;
    const textParts = [];
    for (let cursor = index; cursor < tokens.length; cursor += 1) {
      if (tokens[cursor].type === 'blockquote_open') depth += 1;
      if (tokens[cursor].type === 'blockquote_close') depth -= 1;
      if (tokens[cursor].type === 'inline') textParts.push(inlineText(tokens[cursor]));
      if (depth === 0 && cursor > index) {
        end = cursor;
        break;
      }
    }

    const text = textParts.join(' ');
    if (/reader-supported|affiliate commission|we may earn/i.test(text)) {
      tokens[index].meta = tokens[index].meta || {};
      tokens[index].meta.disclosure = true;
    }
    index = end;
  }
}

function markAffiliateCtas(tokens, affiliates) {
  const byListingId = new Map(
    Object.values(affiliates.products || {}).map((product) => [product.listingId, product])
  );

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
    const token = tokens[tokenIndex];
    if (token.type !== 'inline' || !Array.isArray(token.children)) continue;

    const isParagraph =
      tokens[tokenIndex - 1]?.type === 'paragraph_open' &&
      tokens[tokenIndex + 1]?.type === 'paragraph_close';
    if (!isParagraph) continue;

    const fullText = normalizeCtaText(inlineText(token));

    for (let index = 0; index < token.children.length; index += 1) {
      const child = token.children[index];
      if (child.type !== 'link_open') continue;

      const href = child.attrGet('href') || '';
      if (!isHttpUrl(href)) continue;

      let hostname = '';
      try {
        hostname = new URL(href).hostname;
      } catch {
        continue;
      }
      if (!isAliExpressHost(hostname)) continue;

      const itemId = itemIdFromUrl(href);
      const product = byListingId.get(itemId);
      const linkTextParts = [];
      for (let cursor = index + 1; cursor < token.children.length; cursor += 1) {
        const next = token.children[cursor];
        if (next.type === 'link_close') break;
        if (next.type === 'text' || next.type === 'code_inline') linkTextParts.push(next.content);
      }
      const linkText = normalizeCtaText(linkTextParts.join(''));
      const isCta =
        Boolean(product) &&
        /^(checkprice|checkthevariant|checkthelisting|checkcurrentprice)/.test(linkText) &&
        linkText.length <= 80 &&
        fullText === linkText;

      if (isCta) {
        child.meta = child.meta || {};
        child.meta.cta = true;
      }
    }
  }
}

function extractFaq(markdown, md) {
  const lines = String(markdown).split(/\r?\n/);
  const start = lines.findIndex((line) => /^##\s+FAQ\s*$/i.test(line));
  if (start === -1) return [];

  const items = [];
  let current = null;

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^##\s+/.test(line)) break;
    if (/^###\s+Sources\s*$/i.test(line)) break;

    const question = /^###\s+(.+?)\s*$/.exec(line);
    if (question) {
      if (current) items.push(current);
      current = { question: question[1].trim(), answerLines: [] };
    } else if (current) {
      current.answerLines.push(line);
    }
  }
  if (current) items.push(current);

  return items
    .map((item) => {
      const answerEnv = {
        linkStack: [],
        warnings: [],
        affiliates: { products: {} },
        affiliateByListingId: new Map(),
        imageDimensions: {}
      };
      return {
        q: item.question,
        a: stripHtml(md.render(item.answerLines.join('\n').trim(), answerEnv))
      };
    })
    .filter((item) => item.q && item.a);
}

export function extractInternalLinks(markdown) {
  const links = [];
  const regex = /\]\((\/[^)\s]+)\)/g;
  let match;
  while ((match = regex.exec(String(markdown))) !== null) {
    let href = match[1];
    if (!href.startsWith('/')) continue;
    if (href.startsWith('/images/') || href.startsWith('/og/') || href.startsWith('/styles/')) continue;
    if (/\.(?:svg|png|jpg|jpeg|webp|css|js|xml|txt)$/i.test(href)) continue;
    href = href.split('#')[0].split('?')[0];
    if (!href) continue;
    links.push(href);
  }
  return [...new Set(links)];
}

export function hasSourcesSection(markdown) {
  return /^###\s+Sources\s*$/im.test(String(markdown));
}

export function createMarkdown() {
  const md = new MarkdownIt({
    html: true,
    linkify: false,
    typographer: false,
    breaks: false,
    xhtmlOut: false
  });

  md.renderer.rules.heading_open = (tokens, index) => {
    const token = tokens[index];
    const id = token.attrGet('id');
    const classes = [];
    if (token.meta?.sources) classes.push('sources-heading');
    if (token.meta?.faq) classes.push('faq-heading');
    const classAttr = classes.length ? ` class="${classes.join(' ')}"` : '';
    return `<${token.tag}${id ? ` id="${escapeAttr(id)}"` : ''}${classAttr}>`;
  };

  md.renderer.rules.heading_close = (tokens, index) => `</${tokens[index].tag}>\n`;

  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const href = token.attrGet('href') || '';
    const external = isHttpUrl(href);
    token.meta = token.meta || {};

    if (!external) {
      env.linkStack.push({ external: false, affiliate: false, disabled: false });
      return self.renderToken(tokens, index, options);
    }

    let hostname = '';
    try {
      hostname = new URL(href).hostname;
    } catch {
      hostname = '';
    }

    if (isAliExpressHost(hostname)) {
      const itemId = itemIdFromUrl(href);
      const product = env.affiliateByListingId?.get(itemId);
      let finalHref = href;

      if (product) {
        finalHref = buildAffiliateHref(product.url, env);
      } else {
        env.warnings.push(`AliExpress link not found in affiliates.json: ${href}`);
      }

      if (!finalHref || /PLACEHOLDER|YOUR-/i.test(finalHref)) {
        token.meta.disabled = true;
        env.linkStack.push({ external: true, affiliate: true, disabled: true });
        return '<span class="affiliate-link is-disabled" data-affiliate-pending="true" aria-disabled="true">';
      }

      token.attrSet('href', finalHref);
      token.attrSet('target', '_blank');
      token.attrSet('rel', 'sponsored nofollow noopener');
      token.attrJoin('class', 'affiliate-link');
      if (token.meta.cta) token.attrJoin('class', 'affiliate-cta');
      env.linkStack.push({ external: true, affiliate: true, disabled: false });
      return self.renderToken(tokens, index, options);
    }

    token.attrSet('target', '_blank');
    token.attrSet('rel', 'noopener noreferrer');
    token.attrJoin('class', 'external-link');
    env.linkStack.push({ external: true, affiliate: false, disabled: false });
    return self.renderToken(tokens, index, options);
  };

  md.renderer.rules.link_close = (tokens, index, options, env, self) => {
    const state = env.linkStack?.pop() || {};
    if (state.disabled) return '</span>';
    if (state.external) {
      const hint = state.affiliate
        ? '<span class="visually-hidden"> (affiliate link, opens in a new tab)</span>'
        : '<span class="visually-hidden"> (opens in a new tab)</span>';
      return `${hint}</a>`;
    }
    return '</a>';
  };

  md.renderer.rules.image = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const src = token.attrGet('src') || '';
    const alt = token.content || '';
    const title = token.attrGet('title') || '';
    const dimensions = env.imageDimensions?.[src] || { width: 1200, height: 675 };
    if (!env.imageDimensions?.[src]) {
      env.warnings.push(`No intrinsic dimensions found for image: ${src}`);
    }
    const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
    return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" width="${dimensions.width}" height="${dimensions.height}" loading="lazy" decoding="async"${titleAttr}>`;
  };

  md.renderer.rules.table_open = () =>
    '<div class="table-scroll" role="region" aria-label="Table, scroll horizontally if needed" tabindex="0"><table>\n';
  md.renderer.rules.table_close = () => '</table></div>\n';

  md.renderer.rules.blockquote_open = (tokens, index) => {
    if (tokens[index].meta?.disclosure) {
      return '<blockquote class="disclosure-box">\n<p class="disclosure-label">Affiliate disclosure</p>\n';
    }
    return '<blockquote>\n';
  };

  return md;
}

export function renderMarkdown(markdown, context) {
  const md = context.md || createMarkdown();
  const env = {
    ...context,
    linkStack: [],
    warnings: context.warnings || []
  };
  const tokens = md.parse(markdown, env);
  const headings = prepareHeadings(tokens);
  const hero = extractHero(tokens, context.heroImage);
  markDisclosures(tokens);
  markAffiliateCtas(tokens, context.affiliates);

  const html = md.renderer.render(tokens, md.options, env);
  const toc = headings.filter((heading) => heading.level === 2);
  const faq = context.extractFaq ? extractFaq(markdown, md) : [];

  return {
    html,
    toc,
    hero,
    faq,
    headings,
    warnings: env.warnings
  };
}

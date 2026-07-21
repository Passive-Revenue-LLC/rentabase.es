import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Genera la portada OG (1200x630) de cada artículo del blog en build time,
 * reutilizando la paleta por categoría de ArticleCover.astro. Sustituye al
 * og:image genérico compartido por los 47 artículos.
 */

const categoryStyles: Record<
  string,
  { from: string; to: string; blob: string; eyebrow: string }
> = {
  inversion: {
    from: '#283F3B',
    to: '#111113',
    blob: 'rgba(218, 250, 52, 0.35)',
    eyebrow: 'rgba(218, 250, 52, 0.9)',
  },
  ahorro: {
    from: '#1d4ed8',
    to: '#1e3a8a',
    blob: 'rgba(147, 197, 253, 0.35)',
    eyebrow: 'rgba(191, 219, 254, 0.9)',
  },
  cripto: {
    from: '#f97316',
    to: '#9a3412',
    blob: 'rgba(253, 186, 116, 0.35)',
    eyebrow: 'rgba(254, 215, 170, 0.9)',
  },
  fiscalidad: {
    from: '#7e22ce',
    to: '#581c87',
    blob: 'rgba(192, 132, 252, 0.35)',
    eyebrow: 'rgba(216, 180, 254, 0.9)',
  },
};

const categoryLabels: Record<string, string> = {
  inversion: 'Inversión',
  ahorro: 'Ahorro',
  cripto: 'Criptomonedas',
  fiscalidad: 'Fiscalidad',
};

/**
 * Se leen desde /public (no desde import.meta.url) porque tras el build de
 * Astro el endpoint queda empaquetado y las rutas relativas al módulo ya no
 * apuntan al árbol de fuentes original.
 */
const fontSemiBold = readFileSync(join(process.cwd(), 'public/fonts/FunnelDisplay-SemiBold.ttf'));
const fontBold = readFileSync(join(process.cwd(), 'public/fonts/FunnelDisplay-Bold.ttf'));

export const getStaticPaths = (async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as Awaited<ReturnType<typeof getCollection<'blog'>>>[number];
  const { title, category } = post.data;
  const s = categoryStyles[category];
  const label = categoryLabels[category];

  const titleSize = title.length > 70 ? 50 : title.length > 45 ? 58 : 66;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          padding: '76px',
          background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)`,
          fontFamily: 'Funnel Display',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '-170px',
                right: '-170px',
                width: '620px',
                height: '620px',
                borderRadius: '9999px',
                background: s.blob,
                display: 'flex',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: '26px',
                fontWeight: 600,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: s.eyebrow,
                marginBottom: '28px',
                position: 'relative',
              },
              children: `RentaBase · ${label}`,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#ffffff',
                maxWidth: '980px',
                position: 'relative',
                letterSpacing: '-0.01em',
              },
              children: title,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Funnel Display', data: fontSemiBold, weight: 600, style: 'normal' },
        { name: 'Funnel Display', data: fontBold, weight: 700, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
